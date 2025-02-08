require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON requests

// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhijeet@123',
    database: 'examination_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

// ✅ Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    db.query("SELECT * FROM Users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) {
            console.error("❌ MySQL Query Error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const user = results[0];
        const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });

        res.json({ success: true, user: { id: user.id, username: user.username, role: user.role }, token });
    });
});

// ✅ Student CRUD Operations

// GET all students
app.get('/students', (req, res) => {
    db.query("SELECT * FROM Student", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// GET a single student by ID
app.get('/students/:id', (req, res) => {
    db.query("SELECT * FROM Student WHERE ID = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Student not found' });

        res.json(result[0]);
    });
});

// CREATE a new student
app.post('/students', (req, res) => {
    const { ID, Name, Dept_Name, Total_Credits } = req.body;
    db.query("INSERT INTO Student (ID, Name, Dept_Name, Total_Credits) VALUES (?, ?, ?, ?)", 
        [ID, Name, Dept_Name, Total_Credits], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: 'Student added successfully', studentID: result.insertId });
    });
});

// UPDATE a student
app.put('/students/:id', (req, res) => {
    const { Name, Dept_Name, Total_Credits } = req.body;
    db.query("UPDATE Student SET Name = ?, Dept_Name = ?, Total_Credits = ? WHERE ID = ?", 
        [Name, Dept_Name, Total_Credits, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student updated successfully' });
    });
});

// DELETE a student
app.delete('/students/:id', (req, res) => {
    db.query("DELETE FROM Student WHERE ID = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student deleted successfully' });
    });
});

// ✅ Course CRUD Operations

// GET all courses
app.get('/courses', (req, res) => {
    db.query("SELECT * FROM Course", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// ADD a course
app.post('/courses', (req, res) => {
    const { Course_ID, Title, Dept_Name, Credits } = req.body;
    db.query("INSERT INTO Course VALUES (?, ?, ?, ?)", [Course_ID, Title, Dept_Name, Credits], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: 'Course added successfully' });
    });
});

// ✅ Instructor CRUD Operations

// GET all instructors
app.get('/instructors', (req, res) => {
    db.query("SELECT * FROM Instructor", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// ADD an instructor
app.post('/instructors', (req, res) => {
    const { ID, Name, Dept_Name, Salary } = req.body;
    db.query("INSERT INTO Instructor VALUES (?, ?, ?, ?)", [ID, Name, Dept_Name, Salary], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: 'Instructor added successfully' });
    });
});

// DELETE an instructor
app.delete('/instructors/:id', (req, res) => {
    db.query("DELETE FROM Instructor WHERE ID = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Instructor not found' });

        res.json({ message: 'Instructor deleted successfully' });
    });
});

// ✅ JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const tokenValue = token.split(" ")[1]; // Extract token after "Bearer"

    jwt.verify(tokenValue, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = decoded; // Store decoded user data
        next();
    });
};


// ✅ Protected Route Example (Get Instructor by ID with Authentication)
app.get('/instructors/:id', authenticateJWT, (req, res) => {
    db.query("SELECT * FROM Instructor WHERE ID = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Instructor not found' });

        res.json(result[0]);
    });
});


// ✅ Create a new MCQ (Teachers)
app.post('/mcq', (req, res) => {
    const { question_text, option_a, option_b, option_c, option_d, correct_option, created_by } = req.body;

    // 🔍 Check for missing fields
    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_option || !created_by) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = "INSERT INTO Questions (question_text, option_a, option_b, option_c, option_d, correct_option, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [question_text, option_a, option_b, option_c, option_d, correct_option, created_by], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: "MCQ created successfully!", mcq_id: result.insertId });
    });
});  // checking successfully by postman


// ✅ Get All MCQs Created by a Teacher
app.get('/mcqs/:teacher_id', (req, res) => {
    const query = "SELECT * FROM Questions WHERE created_by = ?";
    db.query(query, [req.params.teacher_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});


// GET All Student Submissions for a teacher's Questions

app.get('/submissions/:id', (req, res) => {
    const query = `
    SELECT s.id, s.student_id, s.mcq_id, s.selected_option, s.is_correct, s.submitted_at, u.username 
    FROM student_submissions s
    JOIN questions q ON s.mcq_id = q.id  -- ✅ Corrected table name
    JOIN users u ON s.student_id = u.id
    WHERE q.created_by = 1`;
    
    db.query(query, [req.params.teacher_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});


app.post("/submissions", (req, res) => {
    const submissions = req.body.submissions;

    if (!submissions || !submissions.length) {
        return res.status(400).json({ error: "No submissions provided" });
    }

    let query = `
        INSERT INTO student_submissions (student_id, mcq_id, selected_option, is_correct) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE selected_option = VALUES(selected_option), 
                                is_correct = VALUES(is_correct)`;

    let values = submissions.map(s => [
        s.student_id, 
        s.mcq_id, 
        s.selected_option,
        `(SELECT correct_option FROM Questions WHERE id = ${s.mcq_id}) = '${s.selected_option}'`
    ]);

    db.query(query, [values], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Exam submitted successfully!" });
    });
});  




// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
