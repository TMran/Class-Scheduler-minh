-- Class Scheduler Database Schema
-- SQLite Version
-- Date: November 2025

-- ================================
-- 1. DEPARTMENTS & MAJORS
-- ================================

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    dean TEXT,
    phone TEXT,
    email TEXT
);

CREATE TABLE IF NOT EXISTS majors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    department_id INTEGER NOT NULL,
    total_credits_required INTEGER DEFAULT 120,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- ================================
-- 2. COURSES
-- ================================

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    course_number TEXT NOT NULL,
    crn INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    prerequisites TEXT,
    UNIQUE(course_code, course_number, crn),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- ================================
-- 3. MAJOR REQUIREMENTS
-- ================================

CREATE TABLE IF NOT EXISTS major_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    major_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    requirement_type TEXT CHECK(requirement_type IN ('core', 'elective')) NOT NULL,
    is_required INTEGER DEFAULT 1,
    UNIQUE(major_id, course_id),
    FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ================================
-- 4. MAGIS CORE (GEN ED)
-- ================================

CREATE TABLE IF NOT EXISTS magis_core_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    min_credits_required INTEGER DEFAULT 3,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS magis_core_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    UNIQUE(category_id, course_id),
    FOREIGN KEY (category_id) REFERENCES magis_core_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ================================
-- 5. SCHEDULING
-- ================================

CREATE TABLE IF NOT EXISTS terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    registration_start TEXT,
    registration_end TEXT,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    department_id INTEGER,
    office_location TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL,
    room_number TEXT NOT NULL,
    capacity INTEGER DEFAULT 30,
    UNIQUE(building_id, room_number),
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    term_id INTEGER NOT NULL,
    section_number TEXT NOT NULL,
    crn TEXT NOT NULL UNIQUE,
    instructor_id INTEGER,
    room_id INTEGER,
    max_seats INTEGER DEFAULT 25,
    enrolled_seats INTEGER DEFAULT 0,
    waitlist_seats INTEGER DEFAULT 0,
    credits INTEGER,
    status TEXT CHECK(status IN ('open', 'closed', 'cancelled', 'waitlist')) DEFAULT 'open',
    notes TEXT,
    UNIQUE(course_id, term_id, section_number),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS meeting_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    day_of_week TEXT CHECK(day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')) NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE
);

-- ================================
-- 7. INDEXES
-- ================================

CREATE INDEX IF NOT EXISTS idx_courses_code_number ON courses(course_code, course_number);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_sections_course_term ON course_sections(course_id, term_id);
CREATE INDEX IF NOT EXISTS idx_sections_crn ON course_sections(crn);
CREATE INDEX IF NOT EXISTS idx_meeting_times_section ON meeting_times(section_id);