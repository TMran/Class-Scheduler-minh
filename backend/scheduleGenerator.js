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
           GROUP_CONCAT(mt.day_of_week || '|' || mt.start_time || '|' || mt.end_time, ';') as meeting_times
    FROM course_sections cs
    JOIN courses c ON cs.course_id = c.id
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
    // Time preferences
    const { preferMorning, preferAfternoon, preferEvening } = preferences.timePreferences || {};
    // Day preferences
    const { mondayWednesdayFriday, tuesdayThursday, noFridays } = preferences.dayPreferences || {};
    let timeOk = false;
    let dayOk = true;
    for (const mt of section.meeting_times) {
      // Time
      const start = parseInt(mt.start_time.replace(':', ''), 10);
      if (preferMorning && start >= 800 && start < 1100) timeOk = true;
      if (preferAfternoon && start >= 1100 && start < 1500) timeOk = true;
      if (preferEvening && start >= 1500 && start <= 1800) timeOk = true;
      // Day
      if (noFridays && mt.day_of_week === 'Friday') dayOk = false;
      if (mondayWednesdayFriday && ['Monday','Wednesday','Friday'].includes(mt.day_of_week)) dayOk = true;
      if (tuesdayThursday && ['Tuesday','Thursday'].includes(mt.day_of_week)) dayOk = true;
    }
    // If no time pref selected, allow all
    if (!preferMorning && !preferAfternoon && !preferEvening) timeOk = true;
    return timeOk && dayOk;
  }

  // Backtracking to generate all valid schedules
  const results = [];
  function backtrack(courseIdx, currentSchedule, currentCredits) {
    if (courseIdx === preferences.requiredCourses.length) {
      // Found a valid schedule
      results.push([...currentSchedule]);
      return;
    }
    const courseId = preferences.requiredCourses[courseIdx];
    const possibleSections = sectionsByCourse[courseId] || [];
    for (const section of possibleSections) {
      if (currentCredits + section.credits > preferences.maxCredits) continue;
      if (!matchesPreferences(section)) continue;
      if (currentSchedule.some(s => hasConflict(s, section))) continue;
      currentSchedule.push(section);
      backtrack(courseIdx + 1, currentSchedule, currentCredits + section.credits);
      currentSchedule.pop();
    }
  }

  backtrack(0, [], 0);
  return results;
}

module.exports = { generateSchedule };