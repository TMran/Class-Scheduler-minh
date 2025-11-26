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
  electiveCourses: number[];
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

interface ControlPanelProps {
  setSchedules: React.Dispatch<React.SetStateAction<Section[][]>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ setSchedules, setCurrentIndex }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [preferences, setPreferences] = useState<SchedulePreferences>({
    major: '',
    year: 'sophomore',
    requiredCourses: [],
    electiveCourses: [],
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
  
  // Elective search states
  const [electiveSearchQuery, setElectiveSearchQuery] = useState('');
  const [electiveSearchResults, setElectiveSearchResults] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentCourses, setDepartmentCourses] = useState<Record<string, Course[]>>({});
  const [showDepartmentBrowser, setShowDepartmentBrowser] = useState(false);
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
  const [selectedElectives, setSelectedElectives] = useState<Course[]>([]);

  // Fetch majors and Magis Core categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [majorsRes, categoriesRes, deptRes] = await Promise.all([
          fetch(`${API_URL}/api/majors`),
          fetch(`${API_URL}/api/magis-core/categories`),
          fetch(`${API_URL}/api/departments`)
        ]);
        
        const majorsData = await majorsRes.json();
        const categoriesData = await categoriesRes.json();
        const deptData = await deptRes.json();
        
        setMajors(majorsData);
        setMagisCategories(categoriesData);
        setDepartments(deptData.map((d: any) => d.code).sort());
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

  const handleElectiveToggle = (courseId: number) => {
    setPreferences(prev => ({
      ...prev,
      electiveCourses: prev.electiveCourses.includes(courseId)
        ? prev.electiveCourses.filter(c => c !== courseId)
        : [...prev.electiveCourses, courseId]
    }));
  };

  const handleElectiveSearch = async () => {
    if (!electiveSearchQuery.trim()) {
      setElectiveSearchResults([]);
      return;
    }
    
    try {
      const params = new URLSearchParams();
      params.append('q', electiveSearchQuery);
      
      const response = await fetch(`${API_URL}/api/courses/search?${params}`);
      const data = await response.json();
      setElectiveSearchResults(data);
    } catch (error) {
      console.error('Error searching courses:', error);
    }
  };

  // Trigger search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleElectiveSearch();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [electiveSearchQuery]);

  // Fetch courses when department is selected
  const handleDepartmentSelect = async (deptCode: string) => {
    // Toggle expansion
    if (expandedDepartment === deptCode) {
      setExpandedDepartment(null);
      return;
    }
    
    setExpandedDepartment(deptCode);
    
    // Fetch courses if not already cached
    if (!departmentCourses[deptCode]) {
      try {
        const params = new URLSearchParams();
        params.append('department', deptCode);
        
        const response = await fetch(`${API_URL}/api/courses/search?${params}`);
        const data = await response.json();
        setDepartmentCourses(prev => ({ ...prev, [deptCode]: data }));
      } catch (error) {
        console.error('Error fetching department courses:', error);
      }
    }
  };

  // Update selected electives when preferences change
  useEffect(() => {
    const allCourses = [
      ...electiveSearchResults,
      ...Object.values(departmentCourses).flat()
    ];
    const selected = preferences.electiveCourses
      .map(id => allCourses.find(c => c.id === id))
      .filter((c): c is Course => c !== undefined);
    setSelectedElectives(selected);
  }, [preferences.electiveCourses, electiveSearchResults, departmentCourses]);

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

  const handleGenerateSchedule = async () => {
    console.log('Generating schedule with preferences:', preferences);
    try {
      const response = await fetch(`${API_URL}/api/generate-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to generate schedule');
      const data = await response.json();
      setSchedules(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule.');
    }
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
                <span>{course.course_code} {course.course_number} {course.title} ({course.credits})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Elective Courses Section */}
      <div className="form-section">
        <h3>Elective Courses</h3>
        <p className="section-description">Search or browse by department to add electives:</p>
        
        {/* Search Bar */}
        <div className="elective-search-bar">
          <input
            type="text"
            placeholder="Search for course"
            value={electiveSearchQuery}
            onChange={(e) => setElectiveSearchQuery(e.target.value)}
            className="elective-search-input"
          />
        </div>
        
        {/* Search Results */}
        {electiveSearchResults.length > 0 && (
          <div className="search-results-dropdown">
            {electiveSearchResults.map(course => (
              <div key={course.id} className="search-result-item">
                <input 
                  type="checkbox"
                  checked={preferences.electiveCourses.includes(course.id)}
                  onChange={() => handleElectiveToggle(course.id)}
                />
                <div className="search-course-info">
                  <strong>{course.course_code} {course.course_number}</strong>
                  <span> {course.title}</span>
                  <span className="course-credits-badge">{course.credits} credits</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Debug info */}
        {electiveSearchQuery.trim() && electiveSearchResults.length === 0 && (
          <div style={{padding: '10px', color: '#666', fontStyle: 'italic'}}>
            No results found for "{electiveSearchQuery}"
          </div>
        )}
        
        {/* Department Browser */}
        <div className="department-browser-container">
          <button
            type="button"
            className={`department-browser-toggle ${showDepartmentBrowser ? 'active' : ''}`}
            onClick={() => setShowDepartmentBrowser(!showDepartmentBrowser)}
          >
            <span>Browse by Department</span>
            <span className="dropdown-arrow">{showDepartmentBrowser ? '▲' : '▼'}</span>
          </button>
          
          {showDepartmentBrowser && (
            <div className="department-list">
              {departments.map(dept => (
                <div key={dept} className="department-section">
                  <button
                    type="button"
                    className={`department-header ${expandedDepartment === dept ? 'expanded' : ''}`}
                    onClick={() => handleDepartmentSelect(dept)}
                  >
                    <span className="dept-code">{dept}</span>
                    <span className="expand-arrow">{expandedDepartment === dept ? '▼' : '▶'}</span>
                  </button>
                  
                  {expandedDepartment === dept && (
                    <div className="department-courses">
                      {!departmentCourses[dept] || departmentCourses[dept].length === 0 ? (
                        <p className="no-courses">No courses available</p>
                      ) : (
                        departmentCourses[dept].map(course => (
                          <label key={course.id} className="course-item">
                            <input 
                              type="checkbox"
                              checked={preferences.electiveCourses.includes(course.id)}
                              onChange={() => handleElectiveToggle(course.id)}
                            />
                            <span className="course-details">
                              <strong>{course.course_code} {course.course_number}</strong>
                              <span className="course-title">{course.title}</span>
                              <span className="course-credits-badge">{course.credits} credits</span>
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Show selected electives */}
        {selectedElectives.length > 0 && (
          <div className="selected-items">
            <p className="selected-label"><strong>Selected Electives ({selectedElectives.length}):</strong></p>
            <div className="selected-chips">
              {selectedElectives.map(course => (
                <div key={course.id} className="selected-chip">
                  {course.course_code} {course.course_number}
                  <button 
                    type="button"
                    onClick={() => handleElectiveToggle(course.id)}
                    className="remove-chip"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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