import React from 'react';
import './CalendarView.css';

const CalendarView: React.FC = () => {
  // Time slots from 8 AM to 6 PM
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="calendar-view">
      <h2>Weekly Schedule</h2>
      
      <div className="calendar-grid">
        {/* Header row */}
        <div className="calendar-header">
          <div className="time-header">Time</div>
          {days.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        
        {/* Time slots */}
        {timeSlots.map(time => (
          <div key={time} className="time-row">
            <div className="time-slot">{time}</div>
            {days.map(day => (
              <div key={`${day}-${time}`} className="schedule-cell">
                {/* This is where scheduled classes will appear */}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="calendar-footer">
        <p>Drag and drop courses here to schedule them</p>
      </div>
    </div>
  );
};

export default CalendarView;