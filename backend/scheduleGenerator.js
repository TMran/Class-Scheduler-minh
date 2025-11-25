const { query } = require('./db');

// Helper: Check for time conflicts between two sections
function hasConflict(sectionA, sectionB) {
  // Returns true if any meeting time overlaps between sectionA and sectionB
  if (!sectionA.meeting_times || !sectionB.meeting_times) return false;
  for (const mtA of sectionA.meeting_times) {
    for (const mtB of sectionB.meeting_times) {
      if (mtA.day_of_week === mtB.day_of_week) {
        // Compare time ranges (assume format 'HH:MM')
        const startA = parseInt(mtA.start_time.replace(':', ''), 10);
        const endA = parseInt(mtA.end_time.replace(':', ''), 10);
        const startB = parseInt(mtB.start_time.replace(':', ''), 10);
        const endB = parseInt(mtB.end_time.replace(':', ''), 10);
        // Overlap if startA < endB && startB < endA
        if (startA < endB && startB < endA) {
          return true;
        }
      }
    }
  }
  return false;
}

// Main greedy schedule function
async function generateSchedule(preferences) {
  // 1. Get all required course sections for the term
  if (!preferences.requiredCourses || preferences.requiredCourses.length === 0) {
    return [];
  }
  const termId = preferences.termId || 2;
  const sections = await query(`
    SELECT cs.*, c.credits, c.course_code, c.course_number, c.title,
           i.first_name || ' ' || i.last_name as instructor_name,
           b.name as building_name,
           r.room_number,
           GROUP_CONCAT(mt.day_of_week || '|' || mt.start_time || '|' || mt.end_time, ';') as meeting_times
    FROM course_sections cs
    JOIN courses c ON cs.course_id = c.id
    LEFT JOIN instructors i ON cs.instructor_id = i.id
    LEFT JOIN rooms r ON cs.room_id = r.id
    LEFT JOIN buildings b ON r.building_id = b.id
    LEFT JOIN meeting_times mt ON cs.id = mt.section_id
    WHERE cs.term_id = ?
      AND cs.course_id IN (${preferences.requiredCourses.join(',')})
    GROUP BY cs.id
    ORDER BY c.course_code, c.course_number, cs.section_number
  `, [termId]);

  // Parse meeting_times into array
  const parsedSections = sections.map(section => ({
    ...section,
    meeting_times: section.meeting_times ? section.meeting_times.split(';').map(mt => {
      const [day, start, end] = mt.split('|');
      return { day_of_week: day, start_time: start, end_time: end };
    }) : []
  }));

  // Group sections by course_id
  const sectionsByCourse = {};
  for (const section of parsedSections) {
    if (!sectionsByCourse[section.course_id]) sectionsByCourse[section.course_id] = [];
    sectionsByCourse[section.course_id].push(section);
  }

  // Helper: Check if section matches time/day preferences
  function matchesPreferences(section) {
    if (!section.meeting_times || section.meeting_times.length === 0) return true;
    const { preferMorning, preferAfternoon, preferEvening } = preferences.timePreferences || {};
    const { mondayWednesdayFriday, tuesdayThursday, noFridays } = preferences.dayPreferences || {};
    
    let timeOk = false;
    let dayOk = true;
    
    // Check if BOTH day preferences are selected
    const bothDayPrefsSelected = mondayWednesdayFriday && tuesdayThursday;
    
    // If BOTH preferences are selected, accept sections that meet on ANY of those days
    if (bothDayPrefsSelected) {
      const allAllowedDays = ['monday', 'wednesday', 'friday', 'tuesday', 'thursday'];
      for (const mt of section.meeting_times) {
        const day = mt.day_of_week.toLowerCase();
        if (!allAllowedDays.includes(day)) {
          console.log(`  Section ${section.course_code} ${section.course_number} rejected: meets on ${day}, not in MWF or T/Th`);
          dayOk = false;
          break;
        }
      }
    }
    // If only ONE day preference is selected, ALL meeting times must match that specific preference
    else if (mondayWednesdayFriday || tuesdayThursday) {
      const allowedDays = mondayWednesdayFriday 
        ? ['monday', 'wednesday', 'friday']
        : ['tuesday', 'thursday'];
      
      for (const mt of section.meeting_times) {
        const day = mt.day_of_week.toLowerCase();
        if (!allowedDays.includes(day)) {
          console.log(`  Section ${section.course_code} ${section.course_number} rejected: meets on ${day}, not matching ${mondayWednesdayFriday ? 'MWF' : 'T/Th'} preference`);
          dayOk = false;
          break;
        }
      }
    }
    
    // Check noFridays preference
    if (noFridays) {
      if (section.meeting_times.some(mt => mt.day_of_week.toLowerCase() === 'friday')) {
        console.log(`  Section ${section.course_code} ${section.course_number} rejected: meets on Friday`);
        dayOk = false;
      }
    }
    
    // Time preference logic
    for (const mt of section.meeting_times) {
      const start = parseInt(mt.start_time.replace(':', ''), 10);
      if (preferMorning && start >= 800 && start < 1100) timeOk = true;
      if (preferAfternoon && start >= 1100 && start < 1500) timeOk = true;
      if (preferEvening && start >= 1500 && start <= 1800) timeOk = true;
    }
    if (!preferMorning && !preferAfternoon && !preferEvening) timeOk = true;
    
    const result = timeOk && dayOk;
    if (result) {
      console.log(`  Section ${section.course_code} ${section.course_number} matches preferences`);
    }
    return result;
  }

  // Backtracking to generate all valid schedules
  console.log('\nStarting schedule generation...');
  console.log('Preferences:', JSON.stringify(preferences, null, 2));
  console.log(`\nFound ${Object.keys(sectionsByCourse).length} courses with sections`);
  
  const results = [];
  function backtrack(courseIdx, currentSchedule, currentCredits) {
    if (courseIdx === preferences.requiredCourses.length) {
      // Only save schedules that have at least one course
      if (currentSchedule.length > 0) {
        console.log(`\nValid schedule #${results.length + 1} found:`);
        currentSchedule.forEach(s => {
          const days = s.meeting_times.map(mt => mt.day_of_week).join('/');
          const times = s.meeting_times.map(mt => `${mt.start_time}-${mt.end_time}`).join(', ');
          console.log(`  ${s.course_code} ${s.course_number}: ${days} ${times}`);
        });
        results.push([...currentSchedule]);
      }
      return;
    }
    const courseId = preferences.requiredCourses[courseIdx];
    const possibleSections = sectionsByCourse[courseId] || [];
    console.log(`\nProcessing course ID ${courseId} (${possibleSections.length} sections available)`);
    
    let foundValidSection = false;
    for (const section of possibleSections) {
      if (currentCredits + section.credits > preferences.maxCredits) {
        console.log(`  Section ${section.course_code} ${section.course_number} exceeds max credits`);
        continue;
      }
      if (!matchesPreferences(section)) continue;
      if (currentSchedule.some(s => hasConflict(s, section))) {
        console.log(`  Section ${section.course_code} ${section.course_number} has time conflict`);
        continue;
      }
      console.log(`Adding ${section.course_code} ${section.course_number} to schedule`);
      foundValidSection = true;
      currentSchedule.push(section);
      backtrack(courseIdx + 1, currentSchedule, currentCredits + section.credits);
      currentSchedule.pop();
    }
    
    // If no valid sections found for this course, skip it and continue with next course
    if (!foundValidSection) {
      console.log(`No valid sections for course ID ${courseId}, skipping to next course`);
      backtrack(courseIdx + 1, currentSchedule, currentCredits);
    }
  }

  backtrack(0, [], 0);
  console.log(`\nTotal schedules generated: ${results.length}\n`);
  return results;
}

module.exports = { generateSchedule };