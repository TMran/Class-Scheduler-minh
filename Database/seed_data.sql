-- Seed Data for Class Scheduler Database
-- Sample data for testing - will be replaced with real Creighton data later
-- Date: November 2025

-- ================================
-- 1. DEPARTMENTS
-- ================================

INSERT INTO departments (name, code, dean, phone, email) VALUES
('Computer Science', 'CS', 'Dr. Robert Mitchell', '402-280-2850', 'cs@creighton.edu'),
('Mathematics', 'MATH', 'Dr. Sarah Thompson', '402-280-2950', 'math@creighton.edu'),
('Business Administration', 'BA', 'Dr. James Wilson', '402-280-3050', 'business@creighton.edu'),
('English', 'ENG', 'Dr. Patricia Davis', '402-280-3150', 'english@creighton.edu'),
('Theology', 'THL', 'Dr. Michael O''Brien', '402-280-3250', 'theology@creighton.edu'),
('Philosophy', 'PHL', 'Dr. Elizabeth Chen', '402-280-3350', 'philosophy@creighton.edu'),
('Biology', 'BIO', 'Dr. David Martinez', '402-280-3450', 'biology@creighton.edu'),
('Chemistry', 'CHM', 'Dr. Jennifer Lee', '402-280-3550', 'chemistry@creighton.edu'),
('Psychology', 'PSY', 'Dr. Amanda Roberts', '402-280-3650', 'psychology@creighton.edu'),
('History', 'HIST', 'Dr. Christopher Moore', '402-280-3750', 'history@creighton.edu');

-- ================================
-- 2. MAJORS
-- ================================

INSERT INTO majors (name, code, department_id, total_credits_required, description, is_active) VALUES
('Computer Science', 'CS', 1, 120, 'Bachelor of Science in Computer Science', 1),
('Mathematics', 'MATH', 2, 120, 'Bachelor of Science in Mathematics', 1),
('Business Administration', 'BA', 3, 120, 'Bachelor of Science in Business Administration', 1),
('English', 'ENG', 4, 120, 'Bachelor of Arts in English', 1),
('Biology', 'BIO', 7, 120, 'Bachelor of Science in Biology', 1),
('Chemistry', 'CHM', 8, 120, 'Bachelor of Science in Chemistry', 1),
('Psychology', 'PSY', 9, 120, 'Bachelor of Arts in Psychology', 1),
('History', 'HIST', 10, 120, 'Bachelor of Arts in History', 1);

-- ================================
-- 3. COURSES
-- ================================

INSERT INTO courses (course_code, course_number, crn, title, description, credits, department_id, prerequisites) VALUES
-- Computer Science Courses
('CSC', '101', 10001, 'Introduction to Computer Science', 'Fundamentals of programming and problem solving', 3, 1, NULL),
('CSC', '156', 10002, 'Computer Science I', 'Introduction to object-oriented programming', 3, 1, NULL),
('CSC', '221', 10003, 'Data Structures', 'Study of data structures and algorithms', 3, 1, 'CSC 156'),
('CSC', '252', 10004, 'Computer Organization', 'Computer architecture and assembly language', 3, 1, 'CSC 156'),
('CSC', '321', 10005, 'Algorithms', 'Design and analysis of algorithms', 3, 1, 'CSC 221'),
('CSC', '340', 10006, 'Database Systems', 'Database design and implementation', 3, 1, 'CSC 221'),
('CSC', '430', 10007, 'Operating Systems', 'Operating system concepts and design', 3, 1, 'CSC 252'),
('CSC', '461', 10008, 'Artificial Intelligence', 'AI concepts and applications', 3, 1, 'CSC 321'),
('CSC', '548', 10009, 'Software Engineering', 'Software development methodologies and practices', 3, 1, 'CSC 221'),

-- Mathematics Courses
('MATH', '245', 20001, 'Calculus I', 'Differential calculus', 4, 2, NULL),
('MATH', '246', 20002, 'Calculus II', 'Integral calculus', 4, 2, 'MATH 245'),
('MATH', '247', 20003, 'Calculus III', 'Multivariable calculus', 4, 2, 'MATH 246'),
('MATH', '250', 20004, 'Discrete Mathematics', 'Logic, sets, and proofs', 3, 2, NULL),
('MATH', '350', 20005, 'Linear Algebra', 'Vector spaces and matrices', 3, 2, 'MATH 245'),
('MATH', '360', 20006, 'Probability and Statistics', 'Statistical methods and probability theory', 3, 2, 'MATH 246'),

-- Business Courses
('BA', '201', 30001, 'Introduction to Business', 'Overview of business fundamentals', 3, 3, NULL),
('BA', '210', 30002, 'Financial Accounting', 'Principles of accounting', 3, 3, NULL),
('BA', '301', 30003, 'Marketing', 'Principles of marketing', 3, 3, 'BA 201'),
('BA', '315', 30004, 'Finance', 'Corporate finance fundamentals', 3, 3, 'BA 210'),
('BA', '350', 30005, 'Organizational Behavior', 'Human behavior in organizations', 3, 3, 'BA 201'),
('BA', '401', 30006, 'Strategic Management', 'Business strategy and planning', 3, 3, 'BA 301'),

-- English Courses
('ENG', '101', 40001, 'Composition I', 'Academic writing and rhetoric', 3, 4, NULL),
('ENG', '201', 40002, 'World Literature', 'Survey of global literature', 3, 4, 'ENG 101'),
('ENG', '225', 40003, 'American Literature', 'Survey of American literary works', 3, 4, 'ENG 101'),
('ENG', '301', 40004, 'Shakespeare', 'Study of Shakespeare works', 3, 4, 'ENG 201'),
('ENG', '350', 40005, 'Creative Writing', 'Fiction and poetry writing workshop', 3, 4, 'ENG 101'),

-- Theology Courses
('THL', '201', 50001, 'Introduction to Theology', 'Foundations of Christian theology', 3, 5, NULL),
('THL', '250', 50002, 'Biblical Studies', 'Old and New Testament introduction', 3, 5, NULL),
('THL', '301', 50003, 'Christian Ethics', 'Moral theology and ethics', 3, 5, NULL),
('THL', '320', 50004, 'World Religions', 'Comparative study of major religions', 3, 5, NULL),

-- Philosophy Courses
('PHL', '201', 60001, 'Introduction to Philosophy', 'Fundamental philosophical questions', 3, 6, NULL),
('PHL', '250', 60002, 'Logic', 'Formal and informal logic', 3, 6, NULL),
('PHL', '301', 60003, 'Ethics', 'Ethical theory and application', 3, 6, NULL),
('PHL', '310', 60004, 'Philosophy of Mind', 'Consciousness and cognition', 3, 6, 'PHL 201'),

-- Biology Courses
('BIO', '103', 70001, 'General Biology I', 'Cell biology and genetics', 4, 7, NULL),
('BIO', '104', 70002, 'General Biology II', 'Evolution and ecology', 4, 7, 'BIO 103'),
('BIO', '250', 70003, 'Anatomy and Physiology', 'Human body systems', 4, 7, 'BIO 103'),
('BIO', '310', 70004, 'Genetics', 'Principles of heredity', 3, 7, 'BIO 103'),
('BIO', '420', 70005, 'Molecular Biology', 'DNA and protein synthesis', 4, 7, 'BIO 310'),

-- Chemistry Courses
('CHM', '211', 80001, 'General Chemistry I', 'Chemical principles and reactions', 4, 8, NULL),
('CHM', '212', 80002, 'General Chemistry II', 'Chemical equilibrium and thermodynamics', 4, 8, 'CHM 211'),
('CHM', '321', 80003, 'Organic Chemistry I', 'Structure and reactions of organic compounds', 4, 8, 'CHM 212'),
('CHM', '322', 80004, 'Organic Chemistry II', 'Advanced organic reactions', 4, 8, 'CHM 321'),

-- Psychology Courses
('PSY', '101', 90001, 'Introduction to Psychology', 'Overview of psychological science', 3, 9, NULL),
('PSY', '220', 90002, 'Developmental Psychology', 'Human development across lifespan', 3, 9, 'PSY 101'),
('PSY', '250', 90003, 'Social Psychology', 'Social influences on behavior', 3, 9, 'PSY 101'),
('PSY', '301', 90004, 'Abnormal Psychology', 'Psychological disorders', 3, 9, 'PSY 101'),
('PSY', '320', 90005, 'Cognitive Psychology', 'Mental processes and cognition', 3, 9, 'PSY 101'),

-- History Courses
('HIST', '101', 100001, 'Western Civilization I', 'Ancient to medieval Europe', 3, 10, NULL),
('HIST', '102', 100002, 'Western Civilization II', 'Renaissance to modern era', 3, 10, NULL),
('HIST', '201', 100003, 'American History I', 'Colonial period to Civil War', 3, 10, NULL),
('HIST', '202', 100004, 'American History II', 'Reconstruction to present', 3, 10, NULL);

-- ================================
-- 4. MAJOR REQUIREMENTS
-- ================================

-- Computer Science Major Requirements
INSERT INTO major_requirements (major_id, course_id, requirement_type, is_required) VALUES
(1, 1, 'core', 1),   -- CSC 101
(1, 2, 'core', 1),   -- CSC 156
(1, 3, 'core', 1),   -- CSC 221
(1, 4, 'core', 1),   -- CSC 252
(1, 5, 'core', 1),   -- CSC 321
(1, 6, 'core', 1),   -- CSC 340
(1, 7, 'core', 1),   -- CSC 430
(1, 9, 'core', 1),   -- CSC 548
(1, 10, 'core', 1),  -- MATH 245
(1, 11, 'core', 1),  -- MATH 246
(1, 13, 'core', 1),  -- MATH 250
(1, 14, 'core', 1),  -- MATH 350
(1, 8, 'elective', 0),  -- CSC 461 (AI)

-- Mathematics Major Requirements
INSERT INTO major_requirements (major_id, course_id, requirement_type, is_required) VALUES
(2, 10, 'core', 1),  -- MATH 245
(2, 11, 'core', 1),  -- MATH 246
(2, 12, 'core', 1),  -- MATH 247
(2, 13, 'core', 1),  -- MATH 250
(2, 14, 'core', 1),  -- MATH 350
(2, 15, 'core', 1),  -- MATH 360

-- Business Major Requirements
INSERT INTO major_requirements (major_id, course_id, requirement_type, is_required) VALUES
(3, 16, 'core', 1),  -- BA 201
(3, 17, 'core', 1),  -- BA 210
(3, 18, 'core', 1),  -- BA 301
(3, 19, 'core', 1),  -- BA 315
(3, 20, 'core', 1),  -- BA 350
(3, 21, 'core', 1),  -- BA 401

-- English Major Requirements
INSERT INTO major_requirements (major_id, course_id, requirement_type, is_required) VALUES
(4, 22, 'core', 1),  -- ENG 101
(4, 23, 'core', 1),  -- ENG 201
(4, 24, 'core', 1),  -- ENG 225
(4, 25, 'core', 1),  -- ENG 301
(4, 26, 'elective', 0),  -- ENG 350

-- Biology Major Requirements
INSERT INTO major_requirements (major_id, course_id, requirement_type, is_required) VALUES
(5, 37, 'core', 1),  -- BIO 103
(5, 38, 'core', 1),  -- BIO 104
(5, 39, 'core', 1),  -- BIO 250
(5, 40, 'core', 1),  -- BIO 310
(5, 41, 'core', 1),  -- BIO 420
(5, 42, 'core', 1),  -- CHM 211
(5, 43, 'core', 1),  -- CHM 212

-- Psychology Major Requirements
INSERT INTO major_requirements (major_id, course_id, requirement_type, is_required) VALUES
(7, 46, 'core', 1),  -- PSY 101
(7, 47, 'core', 1),  -- PSY 220
(7, 48, 'core', 1),  -- PSY 250
(7, 49, 'core', 1),  -- PSY 301
(7, 50, 'core', 1);  -- PSY 320

-- ================================
-- 5. MAGIS CORE CATEGORIES
-- ================================

INSERT INTO magis_core_categories (name, description, min_credits_required, is_active) VALUES
('Written Communication', 'Development of written communication skills', 3, 1),
('Oral Communication', 'Development of oral presentation skills', 3, 1),
('Theological Inquiry', 'Exploration of theological questions and traditions', 6, 1),
('Philosophical Inquiry', 'Critical examination of philosophical ideas', 6, 1),
('Natural Sciences', 'Understanding scientific methods and principles', 6, 1),
('Social and Behavioral Sciences', 'Study of human behavior and society', 6, 1),
('Creative Arts and Cultures', 'Engagement with arts and cultural expression', 3, 1),
('Ethics', 'Moral reasoning and ethical decision-making', 3, 1),
('Global Perspectives', 'Understanding diverse cultures and global issues', 3, 1),
('Quantitative Reasoning', 'Mathematical and analytical thinking', 3, 1);

-- ================================
-- 6. MAGIS CORE REQUIREMENTS
-- ================================

INSERT INTO magis_core_requirements (category_id, course_id) VALUES
-- Written Communication
(1, 22), -- ENG 101

-- Theological Inquiry
(3, 27), -- THL 201
(3, 28), -- THL 250
(3, 29), -- THL 301
(3, 30), -- THL 320

-- Philosophical Inquiry
(4, 31), -- PHL 201
(4, 32), -- PHL 250
(4, 33), -- PHL 301
(4, 34), -- PHL 310

-- Natural Sciences
(5, 37), -- BIO 103
(5, 38), -- BIO 104
(5, 42), -- CHM 211
(5, 43), -- CHM 212

-- Social and Behavioral Sciences
(6, 46), -- PSY 101
(6, 47), -- PSY 220
(6, 48), -- PSY 250
(6, 51), -- HIST 101
(6, 52), -- HIST 102
(6, 53), -- HIST 201
(6, 54), -- HIST 202

-- Creative Arts and Cultures
(7, 23), -- ENG 201 (World Literature)
(7, 30), -- THL 320 (World Religions)

-- Ethics
(8, 29), -- THL 301 (Christian Ethics)
(8, 33), -- PHL 301 (Ethics)

-- Quantitative Reasoning
(10, 10), -- MATH 245
(10, 13); -- MATH 250

-- ================================
-- 7. TERMS
-- ================================

INSERT INTO terms (name, start_date, end_date, registration_start, registration_end, is_active) VALUES
('Fall 2024', '2024-08-26', '2024-12-13', '2024-04-01', '2024-08-30', 0),
('Spring 2025', '2025-01-13', '2025-05-09', '2024-10-15', '2025-01-17', 1),
('Fall 2025', '2025-08-25', '2025-12-12', '2025-04-01', '2025-08-29', 1);

-- ================================
-- 8. INSTRUCTORS
-- ================================

INSERT INTO instructors (first_name, last_name, email, phone, department_id, office_location, is_active) VALUES
-- Computer Science
('David', 'Anderson', 'danderson@creighton.edu', '402-280-2851', 1, 'Hixson-Lied 100', 1),
('Maria', 'Garcia', 'mgarcia@creighton.edu', '402-280-2852', 1, 'Hixson-Lied 101', 1),
('James', 'Wilson', 'jwilson@creighton.edu', '402-280-2853', 1, 'Hixson-Lied 102', 1),
-- Mathematics
('Susan', 'Taylor', 'staylor@creighton.edu', '402-280-2951', 2, 'Hixson-Lied 200', 1),
('Robert', 'Brown', 'rbrown@creighton.edu', '402-280-2952', 2, 'Hixson-Lied 201', 1),
-- Business
('Jennifer', 'Martinez', 'jmartinez@creighton.edu', '402-280-3051', 3, 'Harper Center 300', 1),
('Thomas', 'White', 'twhite@creighton.edu', '402-280-3052', 3, 'Harper Center 301', 1),
('Lisa', 'Harris', 'lharris@creighton.edu', '402-280-3053', 3, 'Harper Center 302', 1),
-- English
('Patricia', 'Clark', 'pclark@creighton.edu', '402-280-3151', 4, 'Old Gym 100', 1),
('Michael', 'Lewis', 'mlewis@creighton.edu', '402-280-3152', 4, 'Old Gym 101', 1),
-- Theology
('Father John', 'Murphy', 'jmurphy@creighton.edu', '402-280-3251', 5, 'Markoe Hall 200', 1),
('Sister Mary', 'O''Connor', 'moconnor@creighton.edu', '402-280-3252', 5, 'Markoe Hall 201', 1),
-- Philosophy
('Daniel', 'Kim', 'dkim@creighton.edu', '402-280-3351', 6, 'Old Gym 200', 1),
('Rebecca', 'Scott', 'rscott@creighton.edu', '402-280-3352', 6, 'Old Gym 201', 1),
-- Biology
('Steven', 'Green', 'sgreen@creighton.edu', '402-280-3451', 7, 'Hixson-Lied 300', 1),
('Laura', 'Adams', 'ladams@creighton.edu', '402-280-3452', 7, 'Hixson-Lied 301', 1),
-- Chemistry
('Brian', 'Nelson', 'bnelson@creighton.edu', '402-280-3551', 8, 'Hixson-Lied 400', 1),
('Amy', 'Carter', 'acarter@creighton.edu', '402-280-3552', 8, 'Hixson-Lied 401', 1),
-- Psychology
('Kevin', 'Mitchell', 'kmitchell@creighton.edu', '402-280-3651', 9, 'Eppley Building 100', 1),
('Nancy', 'Perez', 'nperez@creighton.edu', '402-280-3652', 9, 'Eppley Building 101', 1),
-- History
('Richard', 'Turner', 'rturner@creighton.edu', '402-280-3751', 10, 'Old Gym 300', 1),
('Barbara', 'Phillips', 'bphillips@creighton.edu', '402-280-3752', 10, 'Old Gym 301', 1);

-- ================================
-- 9. BUILDINGS & ROOMS
-- ================================

INSERT INTO buildings (name, address) VALUES
('Hixson-Lied Science Building', '2500 California Plaza'),
('Harper Center', '602 N 20th St'),
('Kiewit Hall', '2408 California St'),
('Old Gym', '2500 California Plaza'),
('Markoe Hall', '2500 California Plaza'),
('Eppley Building', '2500 California Plaza'),
('Skutt Student Center', '2425 California Plaza'),
('Reinert Alumni Library', '2500 California Plaza');

INSERT INTO rooms (building_id, room_number, capacity) VALUES
-- Hixson-Lied Science Building
(1, '100', 30),
(1, '101', 30),
(1, '102', 25),
(1, '103', 35),
(1, '200', 40),
(1, '201', 40),
(1, '202', 35),
(1, '300', 30),
(1, '301', 30),
(1, '400', 25),
(1, '401', 25),
-- Harper Center
(2, '100', 50),
(2, '101', 45),
(2, '200', 40),
(2, '201', 40),
(2, '300', 50),
(2, '301', 45),
-- Kiewit Hall
(3, '101', 30),
(3, '102', 30),
(3, '201', 35),
(3, '202', 35),
-- Old Gym
(4, '100', 25),
(4, '101', 25),
(4, '200', 30),
(4, '201', 30),
(4, '300', 35),
(4, '301', 35),
-- Markoe Hall
(5, '100', 30),
(5, '101', 30),
(5, '200', 35),
(5, '201', 35),
-- Eppley Building
(6, '100', 40),
(6, '101', 40),
(6, '200', 35),
(6, '201', 35);

-- ================================
-- 10. COURSE SECTIONS
-- ================================

INSERT INTO course_sections (course_id, term_id, section_number, crn, instructor_id, room_id, max_seats, enrolled_seats, waitlist_seats, credits, status, notes) VALUES
-- Spring 2025 Computer Science Sections
(1, 2, '001', '10101', 1, 1, 30, 25, 0, 3, 'open', NULL),
(2, 2, '001', '10201', 1, 2, 30, 28, 0, 3, 'open', NULL),
(2, 2, '002', '10202', 2, 3, 30, 22, 0, 3, 'open', NULL),
(3, 2, '001', '10301', 2, 1, 25, 20, 0, 3, 'open', NULL),
(4, 2, '001', '10401', 3, 2, 25, 18, 0, 3, 'open', NULL),
(5, 2, '001', '10501', 2, 3, 25, 22, 0, 3, 'open', NULL),
(6, 2, '001', '10601', 1, 1, 30, 25, 0, 3, 'open', NULL),
(7, 2, '001', '10701', 3, 2, 25, 20, 0, 3, 'open', NULL),
(8, 2, '001', '10801', 2, 3, 25, 15, 0, 3, 'open', NULL),
(9, 2, '001', '10901', 3, 1, 25, 18, 0, 3, 'open', NULL),

-- Mathematics Sections
(10, 2, '001', '20101', 4, 5, 35, 30, 0, 4, 'open', NULL),
(10, 2, '002', '20102', 5, 6, 35, 32, 0, 4, 'open', NULL),
(10, 2, '003', '20103', 4, 7, 35, 28, 0, 4, 'open', NULL),
(11, 2, '001', '20201', 5, 5, 35, 25, 0, 4, 'open', NULL),
(11, 2, '002', '20202', 4, 6, 35, 27, 0, 4, 'open', NULL),
(12, 2, '001', '20301', 5, 7, 30, 22, 0, 4, 'open', NULL),
(13, 2, '001', '20401', 4, 5, 30, 28, 0, 3, 'open', NULL),
(14, 2, '001', '20501', 5, 6, 30, 24, 0, 3, 'open', NULL),
(15, 2, '001', '20601', 4, 7, 30, 26, 0, 3, 'open', NULL),

-- Business Sections
(16, 2, '001', '30101', 6, 13, 50, 45, 0, 3, 'open', NULL),
(16, 2, '002', '30102', 7, 14, 50, 48, 0, 3, 'open', NULL),
(17, 2, '001', '30201', 6, 15, 45, 40, 0, 3, 'open', NULL),
(18, 2, '001', '30301', 7, 16, 40, 35, 0, 3, 'open', NULL),
(19, 2, '001', '30401', 8, 13, 40, 38, 0, 3, 'open', NULL),
(20, 2, '001', '30501', 6, 14, 35, 30, 0, 3, 'open', NULL),
(21, 2, '001', '30601', 7, 15, 30, 25, 0, 3, 'open', NULL),

-- English Sections
(22, 2, '001', '40101', 9, 19, 25, 22, 0, 3, 'open', NULL),
(22, 2, '002', '40102', 10, 20, 25, 24, 0, 3, 'open', NULL),
(22, 2, '003', '40103', 9, 21, 25, 20, 0, 3, 'open', NULL),
(23, 2, '001', '40201', 10, 22, 30, 25, 0, 3, 'open', NULL),
(24, 2, '001', '40301', 9, 19, 30, 28, 0, 3, 'open', NULL),
(25, 2, '001', '40401', 10, 20, 25, 20, 0, 3, 'open', NULL),
(26, 2, '001', '40501', 9, 21, 20, 15, 0, 3, 'open', NULL),

-- Theology Sections
(27, 2, '001', '50101', 11, 27, 30, 28, 0, 3, 'open', NULL),
(27, 2, '002', '50102', 12, 28, 30, 25, 0, 3, 'open', NULL),
(28, 2, '001', '50201', 11, 29, 30, 22, 0, 3, 'open', NULL),
(29, 2, '001', '50301', 12, 30, 30, 24, 0, 3, 'open', NULL),
(30, 2, '001', '50401', 11, 27, 35, 30, 0, 3, 'open', NULL),

-- Philosophy Sections
(31, 2, '001', '60101', 13, 23, 30, 25, 0, 3, 'open', NULL),
(31, 2, '002', '60102', 14, 24, 30, 27, 0, 3, 'open', NULL),
(32, 2, '001', '60201', 13, 25, 25, 20, 0, 3, 'open', NULL),
(33, 2, '001', '60301', 14, 26, 30, 28, 0, 3, 'open', NULL),
(34, 2, '001', '60401', 13, 23, 25, 22, 0, 3, 'open', NULL),

-- Biology Sections
(37, 2, '001', '70101', 15, 8, 35, 32, 0, 4, 'open', NULL),
(37, 2, '002', '70102', 16, 9, 35, 30, 0, 4, 'open', NULL),
(38, 2, '001', '70201', 15, 10, 35, 28, 0, 4, 'open', NULL),
(39, 2, '001', '70301', 16, 8, 30, 25, 0, 4, 'open', NULL),
(40, 2, '001', '70401', 15, 9, 25, 22, 0, 3, 'open', NULL),
(41, 2, '001', '70501', 16, 10, 20, 18, 0, 4, 'open', NULL),

-- Chemistry Sections
(42, 2, '001', '80101', 17, 11, 35, 32, 0, 4, 'open', NULL),
(42, 2, '002', '80102', 18, 12, 35, 30, 0, 4, 'open', NULL),
(43, 2, '001', '80201', 17, 11, 35, 28, 0, 4, 'open', NULL),
(44, 2, '001', '80301', 18, 12, 30, 25, 0, 4, 'open', NULL),
(45, 2, '001', '80401', 17, 11, 25, 20, 0, 4, 'open', NULL),

-- Psychology Sections
(46, 2, '001', '90101', 19, 35, 40, 38, 0, 3, 'open', NULL),
(46, 2, '002', '90102', 20, 36, 40, 35, 0, 3, 'open', NULL),
(47, 2, '001', '90201', 19, 37, 35, 30, 0, 3, 'open', NULL),
(48, 2, '001', '90301', 20, 38, 35, 32, 0, 3, 'open', NULL),
(49, 2, '001', '90401', 19, 35, 30, 25, 0, 3, 'open', NULL),
(50, 2, '001', '90501', 20, 36, 30, 28, 0, 3, 'open', NULL),

-- History Sections
(51, 2, '001', '100101', 21, 31, 35, 30, 0, 3, 'open', NULL),
(52, 2, '001', '100201', 22, 32, 35, 28, 0, 3, 'open', NULL),
(53, 2, '001', '100301', 21, 33, 30, 25, 0, 3, 'open', NULL),
(54, 2, '001', '100401', 22, 34, 30, 27, 0, 3, 'open', NULL);

-- ================================
-- 11. MEETING TIMES
-- ================================

INSERT INTO meeting_times (section_id, day_of_week, start_time, end_time) VALUES
-- Computer Science sections
(1, 'monday', '09:00', '09:50'),
(1, 'wednesday', '09:00', '09:50'),
(1, 'friday', '09:00', '09:50'),
(2, 'tuesday', '10:00', '11:15'),
(2, 'thursday', '10:00', '11:15'),
(3, 'monday', '13:00', '14:15'),
(3, 'wednesday', '13:00', '14:15'),
(4, 'monday', '10:00', '10:50'),
(4, 'wednesday', '10:00', '10:50'),
(4, 'friday', '10:00', '10:50'),
(5, 'tuesday', '13:00', '14:15'),
(5, 'thursday', '13:00', '14:15'),
(6, 'monday', '14:00', '14:50'),
(6, 'wednesday', '14:00', '14:50'),
(6, 'friday', '14:00', '14:50'),
(7, 'tuesday', '15:30', '16:45'),
(7, 'thursday', '15:30', '16:45'),
(8, 'monday', '11:00', '11:50'),
(8, 'wednesday', '11:00', '11:50'),
(8, 'friday', '11:00', '11:50'),
(9, 'tuesday', '09:00', '10:15'),
(9, 'thursday', '09:00', '10:15'),
(10, 'monday', '15:00', '15:50'),
(10, 'wednesday', '15:00', '15:50'),
(10, 'friday', '15:00', '15:50'),

-- Mathematics sections
(11, 'monday', '08:00', '08:50'),
(11, 'wednesday', '08:00', '08:50'),
(11, 'friday', '08:00', '08:50'),
(12, 'tuesday', '08:00', '09:15'),
(12, 'thursday', '08:00', '09:15'),
(13, 'monday', '10:00', '10:50'),
(13, 'wednesday', '10:00', '10:50'),
(13, 'friday', '10:00', '10:50'),
(14, 'monday', '09:00', '09:50'),
(14, 'wednesday', '09:00', '09:50'),
(14, 'friday', '09:00', '09:50'),
(15, 'tuesday', '10:00', '11:15'),
(15, 'thursday', '10:00', '11:15'),
(16, 'monday', '11:00', '11:50'),
(16, 'wednesday', '11:00', '11:50'),
(16, 'friday', '11:00', '11:50'),
(17, 'tuesday', '13:00', '14:15'),
(17, 'thursday', '13:00', '14:15'),
(18, 'monday', '13:00', '13:50'),
(18, 'wednesday', '13:00', '13:50'),
(18, 'friday', '13:00', '13:50'),
(19, 'tuesday', '15:30', '16:45'),
(19, 'thursday', '15:30', '16:45'),

-- Business sections
(20, 'monday', '09:00', '09:50'),
(20, 'wednesday', '09:00', '09:50'),
(20, 'friday', '09:00', '09:50'),
(21, 'tuesday', '09:00', '10:15'),
(21, 'thursday', '09:00', '10:15'),
(22, 'monday', '10:00', '10:50'),
(22, 'wednesday', '10:00', '10:50'),
(22, 'friday', '10:00', '10:50'),
(23, 'tuesday', '13:00', '14:15'),
(23, 'thursday', '13:00', '14:15'),
(24, 'monday', '13:00', '13:50'),
(24, 'wednesday', '13:00', '13:50'),
(24, 'friday', '13:00', '13:50'),
(25, 'tuesday', '14:30', '15:45'),
(25, 'thursday', '14:30', '15:45'),
(26, 'monday', '15:00', '15:50'),
(26, 'wednesday', '15:00', '15:50'),
(26, 'friday', '15:00', '15:50'),

-- English sections
(27, 'monday', '08:00', '08:50'),
(27, 'wednesday', '08:00', '08:50'),
(27, 'friday', '08:00', '08:50'),
(28, 'tuesday', '08:00', '09:15'),
(28, 'thursday', '08:00', '09:15'),
(29, 'monday', '09:00', '09:50'),
(29, 'wednesday', '09:00', '09:50'),
(29, 'friday', '09:00', '09:50'),
(30, 'monday', '11:00', '11:50'),
(30, 'wednesday', '11:00', '11:50'),
(30, 'friday', '11:00', '11:50'),
(31, 'tuesday', '10:00', '11:15'),
(31, 'thursday', '10:00', '11:15'),
(32, 'monday', '14:00', '14:50'),
(32, 'wednesday', '14:00', '14:50'),
(32, 'friday', '14:00', '14:50'),
(33, 'tuesday', '13:00', '14:15'),
(33, 'thursday', '13:00', '14:15'),

-- Theology sections
(34, 'monday', '09:00', '09:50'),
(34, 'wednesday', '09:00', '09:50'),
(34, 'friday', '09:00', '09:50'),
(35, 'tuesday', '09:00', '10:15'),
(35, 'thursday', '09:00', '10:15'),
(36, 'monday', '10:00', '10:50'),
(36, 'wednesday', '10:00', '10:50'),
(36, 'friday', '10:00', '10:50'),
(37, 'tuesday', '13:00', '14:15'),
(37, 'thursday', '13:00', '14:15'),
(38, 'monday', '13:00', '13:50'),
(38, 'wednesday', '13:00', '13:50'),
(38, 'friday', '13:00', '13:50'),

-- Philosophy sections
(39, 'monday', '11:00', '11:50'),
(39, 'wednesday', '11:00', '11:50'),
(39, 'friday', '11:00', '11:50'),
(40, 'tuesday', '10:00', '11:15'),
(40, 'thursday', '10:00', '11:15'),
(41, 'monday', '14:00', '14:50'),
(41, 'wednesday', '14:00', '14:50'),
(41, 'friday', '14:00', '14:50'),
(42, 'tuesday', '14:30', '15:45'),
(42, 'thursday', '14:30', '15:45'),
(43, 'monday', '15:00', '15:50'),
(43, 'wednesday', '15:00', '15:50'),
(43, 'friday', '15:00', '15:50'),

-- Biology sections
(44, 'monday', '08:00', '09:15'),
(44, 'wednesday', '08:00', '09:15'),
(45, 'tuesday', '10:00', '11:15'),
(45, 'thursday', '10:00', '11:15'),
(46, 'monday', '10:00', '11:15'),
(46, 'wednesday', '10:00', '11:15'),
(47, 'tuesday', '13:00', '14:15'),
(47, 'thursday', '13:00', '14:15'),
(48, 'monday', '13:00', '13:50'),
(48, 'wednesday', '13:00', '13:50'),
(48, 'friday', '13:00', '13:50'),
(49, 'tuesday', '15:30', '16:45'),
(49, 'thursday', '15:30', '16:45'),

-- Chemistry sections
(50, 'monday', '09:00', '10:15'),
(50, 'wednesday', '09:00', '10:15'),
(51, 'tuesday', '08:00', '09:15'),
(51, 'thursday', '08:00', '09:15'),
(52, 'monday', '13:00', '14:15'),
(52, 'wednesday', '13:00', '14:15'),
(53, 'tuesday', '13:00', '14:15'),
(53, 'thursday', '13:00', '14:15'),
(54, 'monday', '15:00', '16:15'),
(54, 'wednesday', '15:00', '16:15'),

-- Psychology sections
(55, 'monday', '09:00', '09:50'),
(55, 'wednesday', '09:00', '09:50'),
(55, 'friday', '09:00', '09:50'),
(56, 'tuesday', '10:00', '11:15'),
(56, 'thursday', '10:00', '11:15'),
(57, 'monday', '11:00', '11:50'),
(57, 'wednesday', '11:00', '11:50'),
(57, 'friday', '11:00', '11:50'),
(58, 'tuesday', '13:00', '14:15'),
(58, 'thursday', '13:00', '14:15'),
(59, 'monday', '14:00', '14:50'),
(59, 'wednesday', '14:00', '14:50'),
(59, 'friday', '14:00', '14:50'),
(60, 'tuesday', '15:30', '16:45'),
(60, 'thursday', '15:30', '16:45'),

-- History sections
(61, 'monday', '10:00', '10:50'),
(61, 'wednesday', '10:00', '10:50'),
(61, 'friday', '10:00', '10:50'),
(62, 'tuesday', '09:00', '10:15'),
(62, 'thursday', '09:00', '10:15'),
(63, 'monday', '13:00', '13:50'),
(63, 'wednesday', '13:00', '13:50'),
(63, 'friday', '13:00', '13:50'),
(64, 'tuesday', '14:30', '15:45'),
(64, 'thursday', '14:30', '15:45');
