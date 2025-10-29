import React, { useState } from 'react';
import './ControlPanel.css';

interface SchedulePreferences {
  major: string;
  year: string;
  requiredCourses: string[];
  genEdPreferences: string[];
  timePreferences: {
    preferMorning: boolean;
    preferAfternoon: boolean;
    preferEvening: boolean;
  };
  dayPreferences: {
    mondayWednesdayFriday: boolean;
    tuesdayThursday: boolean;
    noFridays: boolean;
  };
  maxCredits: number;
}

const ControlPanel: React.FC = () => {
  const [preferences, setPreferences] = useState<SchedulePreferences>({
    major: '',
    year: 'sophomore',
    requiredCourses: [],
    genEdPreferences: [],
    timePreferences: {
      preferMorning: false,
      preferAfternoon: true,
      preferEvening: false
    },
    dayPreferences: {
      mondayWednesdayFriday: false,
      tuesdayThursday: false,
      noFridays: false
    },
    maxCredits: 15
  });

  const majors = [
    'Computer Science',
    'Business Administration',
    'Psychology', 
    'Biology',
    'Engineering',
    'English',
    'Mathematics',
    'History'
  ];

  const availableCourses = {
    'Computer Science': [
      'CSC 548 - Advanced Web Development',
      'CSC 560 - Database Systems', 
      'CSC 420 - Software Engineering',
      'CSC 315 - Data Structures',
      'CSC 425 - Computer Networks'
    ],
    'Business Administration': [
      'BUS 101 - Intro to Business',
      'BUS 250 - Marketing Principles',
      'BUS 300 - Operations Management',
      'ACC 201 - Financial Accounting'
    ],
    // Add more as needed...
  };

  const genEdOptions = [
    'English Composition I',
    'English Composition II',
    'College Mathematics',
    'Science with Lab',
    'Biology',
    'Chemistry', 
    'Physics',
    'Psychology',
    'Sociology',
    'History',
    'Philosophy',
    'Art History',
    'Music Appreciation',
    'Foreign Language',
    'Literature',
    'Political Science',
    'Economics',
    'Environmental Science'
  ];

  const [showGenEdDropdown, setShowGenEdDropdown] = useState(false);

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({
      ...prev,
      major: e.target.value,
      requiredCourses: [] // Reset courses when major changes
    }));
  };

  const handleCourseToggle = (course: string) => {
    setPreferences(prev => ({
      ...prev,
      requiredCourses: prev.requiredCourses.includes(course)
        ? prev.requiredCourses.filter(c => c !== course)
        : [...prev.requiredCourses, course]
    }));
  };

  const handleGenEdToggle = (genEd: string) => {
    setPreferences(prev => ({
      ...prev,
      genEdPreferences: prev.genEdPreferences.includes(genEd)
        ? prev.genEdPreferences.filter(g => g !== genEd)
        : [...prev.genEdPreferences, genEd]
    }));
  };

  const handleTimePreferenceChange = (pref: keyof typeof preferences.timePreferences) => {
    setPreferences(prev => ({
      ...prev,
      timePreferences: {
        ...prev.timePreferences,
        [pref]: !prev.timePreferences[pref]
      }
    }));
  };

  const handleDayPreferenceChange = (pref: keyof typeof preferences.dayPreferences) => {
    setPreferences(prev => ({
      ...prev,
      dayPreferences: {
        ...prev.dayPreferences,
        [pref]: !prev.dayPreferences[pref]
      }
    }));
  };

  const handleGenerateSchedule = () => {
    console.log('Generating schedule with preferences:', preferences);
    // This is where you'd call your schedule generation logic
    alert('Schedule generation would happen here! Check console for preferences.');
  };

  return (
    <div className="control-panel">
      <h2>Schedule Generator</h2>
      
      {/* Student Info Section */}
      <div className="form-section">
        <h3>📚 Student Information</h3>
        
        <div className="form-group">
          <label>Major:</label>
          <select value={preferences.major} onChange={handleMajorChange}>
            <option value="">Select your major</option>
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Academic Year:</label>
          <select 
            value={preferences.year} 
            onChange={(e) => setPreferences(prev => ({...prev, year: e.target.value}))}
          >
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div className="form-group">
          <label>Max Credits: {preferences.maxCredits}</label>
          <input 
            type="range" 
            min="12" 
            max="18" 
            value={preferences.maxCredits}
            onChange={(e) => setPreferences(prev => ({...prev, maxCredits: parseInt(e.target.value)}))}
          />
        </div>
      </div>

      {/* Required Courses Section */}
      {preferences.major && (
        <div className="form-section">
          <h3>📝 Required Courses</h3>
          <p className="section-description">Select courses you still need to take:</p>
          <div className="checkbox-grid">
            {(availableCourses[preferences.major as keyof typeof availableCourses] || []).map(course => (
              <label key={course} className="checkbox-item">
                <input 
                  type="checkbox"
                  checked={preferences.requiredCourses.includes(course)}
                  onChange={() => handleCourseToggle(course)}
                />
                <span>{course}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Gen Ed Section */}
      <div className="form-section">
        <h3>🌟 Magis Core Requirements</h3>
        <p className="section-description">Select Magis Core courses you still need to complete:</p>
        
        <div className="dropdown-container">
          <button 
            type="button"
            className="dropdown-button"
            onClick={() => setShowGenEdDropdown(!showGenEdDropdown)}
          >
            Select Magis Core Requirements ({preferences.genEdPreferences.length} selected)
            <span className={`dropdown-arrow ${showGenEdDropdown ? 'open' : ''}`}>▼</span>
          </button>
          
          {showGenEdDropdown && (
            <div className="dropdown-content">
              {genEdOptions.map(genEd => (
                <label key={genEd} className="dropdown-item">
                  <input 
                    type="checkbox"
                    checked={preferences.genEdPreferences.includes(genEd)}
                    onChange={() => handleGenEdToggle(genEd)}
                  />
                  <span>{genEd}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Show selected gen eds */}
        {preferences.genEdPreferences.length > 0 && (
          <div className="selected-items">
            <h4>Selected Requirements:</h4>
            <div className="selected-tags">
              {preferences.genEdPreferences.map(genEd => (
                <span key={genEd} className="tag">
                  {genEd}
                  <button 
                    type="button"
                    onClick={() => handleGenEdToggle(genEd)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time Preferences */}
      <div className="form-section">
        <h3>⏰ Time Preferences</h3>
        <div className="checkbox-grid">
          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={preferences.timePreferences.preferMorning}
              onChange={() => handleTimePreferenceChange('preferMorning')}
            />
            <span>Morning Classes (8 AM - 11 AM)</span>
          </label>
          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={preferences.timePreferences.preferAfternoon}
              onChange={() => handleTimePreferenceChange('preferAfternoon')}
            />
            <span>Afternoon Classes (11 AM - 3 PM)</span>
          </label>
          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={preferences.timePreferences.preferEvening}
              onChange={() => handleTimePreferenceChange('preferEvening')}
            />
            <span>Evening Classes (3 PM - 6 PM)</span>
          </label>
        </div>
      </div>

      {/* Day Preferences */}
      <div className="form-section">
        <h3>📅 Day Preferences</h3>
        <div className="checkbox-grid">
          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={preferences.dayPreferences.mondayWednesdayFriday}
              onChange={() => handleDayPreferenceChange('mondayWednesdayFriday')}
            />
            <span>Prefer MWF Classes</span>
          </label>
          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={preferences.dayPreferences.tuesdayThursday}
              onChange={() => handleDayPreferenceChange('tuesdayThursday')}
            />
            <span>Prefer T/Th Classes</span>
          </label>
          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={preferences.dayPreferences.noFridays}
              onChange={() => handleDayPreferenceChange('noFridays')}
            />
            <span>No Friday Classes</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="generate-section">
        <button 
          onClick={handleGenerateSchedule} 
          className="generate-btn"
          disabled={!preferences.major}
        >
          🚀 Generate My Schedule
        </button>
        {!preferences.major && (
          <p className="help-text">Please select your major to continue</p>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;