import React, { useState } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import CalendarView from './components/CalendarView';

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
}

function App() {
  const [schedules, setSchedules] = useState<Section[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(schedules.length - 1, i + 1));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Class Scheduler</h1>
      </header>
      <div className="main-container">
        <div className="left-panel">
          <ControlPanel 
            setSchedules={setSchedules}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
        <div className="right-panel">
          <CalendarView 
            schedules={schedules}
            currentIndex={currentIndex}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
