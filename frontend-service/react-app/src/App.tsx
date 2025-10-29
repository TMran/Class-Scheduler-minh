import React from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import CalendarView from './components/CalendarView';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Class Scheduler</h1>
      </header>
      <div className="main-container">
        <div className="left-panel">
          <ControlPanel />
        </div>
        <div className="right-panel">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}

export default App;
