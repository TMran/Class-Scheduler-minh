import React, { useState, useEffect } from 'react';
import './ControlPanel.css';

interface Major {
  id: number;
  name: string;
  code: string;
  department_name: string;
}

interface Course {
  id: number;
  course_code: string;
  course_number: string;
  title: string;
  credits: number;
  requirement_type?: string;
}

interface MagisCoreCategory {
  id: number;
  name: string;
  description: string;
  min_credits_required: number;
}

interface SchedulePreferences {
  major: string;
  year: string;
  requiredCourses: number[];
  genEdPreferences: number[];
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
  const API_URL = 'http://localhost:8080';

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

  // State for data from backend
  const [majors, setMajors] = useState<Major[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [magisCategories, setMagisCategories] = useState<MagisCoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenEdDropdown, setShowGenEdDropdown] = useState(false);

  // Fetch majors and Magis Core categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [majorsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/majors`),
          fetch(`${API_URL}/api/magis-core/categories`)
        ]);
        
        const majorsData = await majorsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setMajors(majorsData);
        setMagisCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch courses when major is selected
  useEffect(() => {
    const fetchCourses = async () => {
      if (!preferences.major) {
        setAvailableCourses([]);
        return;
      }
      
      try {
        const selectedMajor = majors.find(m => m.id.toString() === preferences.major);
        if (!selectedMajor) return;
        
        const response = await fetch(`${API_URL}/api/majors/${selectedMajor.id}/courses`);
        const coursesData = await response.json();
        setAvailableCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, [preferences.major, majors]);

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({
      ...prev,
      major: e.target.value,
      requiredCourses: [] // Reset courses when major changes
    }));
  };

  const handleCourseToggle = (courseId: number) => {
    setPreferences(prev => ({
      ...prev,
      requiredCourses: prev.requiredCourses.includes(courseId)
        ? prev.requiredCourses.filter(c => c !== courseId)
        : [...prev.requiredCourses, courseId]
    }));
  };

  const handleGenEdToggle = (categoryId: number) => {
    setPreferences(prev => ({
      ...prev,
      genEdPreferences: prev.genEdPreferences.includes(categoryId)
        ? prev.genEdPreferences.filter(g => g !== categoryId)
        : [...prev.genEdPreferences, categoryId]
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
        <h3>Student Information</h3>
        
        <div className="form-group">
          <label>Major:</label>
          <select value={preferences.major} onChange={handleMajorChange} disabled={loading}>
            <option value="">{loading ? 'Loading...' : 'Select your major'}</option>
            {majors.map(major => (
              <option key={major.id} value={major.id}>{major.name}</option>
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
      {preferences.major && availableCourses.length > 0 && (
        <div className="form-section">
          <h3>Required Courses</h3>
          <p className="section-description">Select courses you still need to take:</p>
          <div className="checkbox-grid">
            {availableCourses.map(course => (
              <label key={course.id} className="checkbox-item">
                <input 
                  type="checkbox"
                  checked={preferences.requiredCourses.includes(course.id)}
                  onChange={() => handleCourseToggle(course.id)}
                />
                <span>{course.course_code} {course.course_number} - {course.title} ({course.credits})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Gen Ed Section */}
      <div className="form-section">
        <h3>Magis Core Requirements</h3>
        <p className="section-description">Select Magis Core categories you still need to complete:</p>
        
        <div className="dropdown-container">
          <button 
            type="button"
            className="dropdown-button"
            onClick={() => setShowGenEdDropdown(!showGenEdDropdown)}
            disabled={loading}
          >
            Select Magis Core Requirements ({preferences.genEdPreferences.length} selected)
            <span className={`dropdown-arrow ${showGenEdDropdown ? 'open' : ''}`}>▼</span>
          </button>
          
          {showGenEdDropdown && (
            <div className="dropdown-content">
              {magisCategories.map(category => (
                <label key={category.id} className="dropdown-item">
                  <input 
                    type="checkbox"
                    checked={preferences.genEdPreferences.includes(category.id)}
                    onChange={() => handleGenEdToggle(category.id)}
                  />
                  <span>{category.name} ({category.min_credits_required})</span>
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
              {preferences.genEdPreferences.map(categoryId => {
                const category = magisCategories.find(c => c.id === categoryId);
                return category ? (
                  <span key={categoryId} className="tag">
                    {category.name}
                    <button 
                      type="button"
                      onClick={() => handleGenEdToggle(categoryId)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Time Preferences */}
      <div className="form-section">
        <h3>Time Preferences</h3>
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
        <h3>Day Preferences</h3>
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
          Generate My Schedule
        </button>
        {!preferences.major && (
          <p className="help-text">Please select your major to continue</p>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;