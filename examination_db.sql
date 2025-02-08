CREATE DATABASE examination_db;
USE examination_db;


CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Teacher', 'Student') NOT NULL
);

INSERT INTO users (id, username, password, role)
VALUES
    (22510014, 'abhijeetgorhe', 'student123', 'Student');

SELECT * FROM Users;


CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);



DROP TABLE questions;
DELETE FROM questions WHERE created_by = 1;
SELECT * FROM questions;


CREATE TABLE student_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    mcq_id INT NOT NULL,
    selected_option CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mcq_id) REFERENCES questions(id) ON DELETE CASCADE
);

DROP TABLE student_submissions;
SELECT * FROM student_submissions;

 











