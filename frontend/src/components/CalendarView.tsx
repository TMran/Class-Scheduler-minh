import React from 'react';
import './CalendarView.css';

interface MeetingTime {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface Section {
  course_code: string;
  course_number: string;
  title: string;
  meeting_times: MeetingTime[];
  crn?: string;
  credits?: number;
  instructor_name?: string;
  building_name?: string;
  room_number?: string;
  available_seats?: number;
}

interface CalendarViewProps {
  schedules: Section[][];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CalendarView: React.FC<CalendarViewProps> = ({ schedules, currentIndex, onPrev, onNext }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="calendar-view">
        <div className="calendar-header-row">
          <h2>Weekly Schedule</h2>
        </div>
        <div className="no-schedule">No schedule found. Please generate a schedule.</div>
      </div>
    );
  }

  const schedule = schedules[currentIndex] || [];

  function getSectionForCell(day: string, time: string) {
    function toAmPm(hm: string) {
      const [h, m] = hm.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour = ((h + 11) % 12) + 1;
      return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    for (const section of schedule) {
      for (const mt of section.meeting_times) {
        const mtDay = mt.day_of_week.charAt(0).toUpperCase() + mt.day_of_week.slice(1).toLowerCase();
        const mtTime = toAmPm(mt.start_time);
        if (mtDay === day && mtTime === time) {
          return { section, meetingTime: mt };
        }
      }
    }
    return undefined;
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header-row">
        <h2>Weekly Schedule</h2>
        <div className="calendar-arrows">
          <button onClick={onPrev} disabled={currentIndex === 0}>&lt;</button>
          <span>{currentIndex + 1} / {schedules.length}</span>
          <button onClick={onNext} disabled={currentIndex === schedules.length - 1}>&gt;</button>
        </div>
      </div>
      <div className="calendar-grid">
        <div className="calendar-header">
          <div className="time-header">Time</div>
          {days.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        {timeSlots.map(time => (
          <div key={time} className="time-row">
            <div className="time-slot">{time}</div>
            {days.map(day => {
              const result = getSectionForCell(day, time);
              return (
                <div key={`${day}-${time}`} className="schedule-cell">
                  {result ? (
                    <div className="course-info">
                      <div className="course-header">
                        <strong>{result.section.course_code} {result.section.course_number}</strong>
                      </div>
                      <div className="course-title">{result.section.title}</div>
                      <div className="course-time">
                        {result.meetingTime.start_time} - {result.meetingTime.end_time}
                      </div>
                      {result.section.building_name && result.section.room_number && (
                        <div className="course-room">{result.section.building_name} {result.section.room_number}</div>
                      )}
                      {result.section.instructor_name && (
                        <div className="course-instructor">{result.section.instructor_name}</div>
                      )}
                      <div className="course-details">
                        {result.section.crn && <span className="course-crn">CRN: {result.section.crn}</span>}
                        {result.section.credits && <span className="course-credits">{result.section.credits} credits</span>}
                        {result.section.available_seats !== undefined && (
                          <span className="course-seats">{result.section.available_seats} seats</span>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;