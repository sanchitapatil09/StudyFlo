const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initial seed data fallback in case data.json is missing or invalid
const DEFAULT_DATA = {
  subjects: ["Math", "Physics", "History", "Computer Science", "Biology"],
  subjectColors: {
    "Math": "#6366f1",
    "Physics": "#0ea5e9",
    "History": "#f59e0b",
    "Computer Science": "#10b981",
    "Biology": "#ec4899"
  },
  assignments: [
    { id: 1, title: "Calculus HW1 - Limits & Continuity", subject: "Math", dueDate: "2026-09-20", status: "pending" },
    { id: 2, title: "Electromagnetism Lab Report", subject: "Physics", dueDate: "2026-09-15", status: "pending" },
    { id: 3, title: "French Revolution Essay", subject: "History", dueDate: "2026-09-10", status: "completed" },
    { id: 4, title: "Binary Search Tree Implementation", subject: "Computer Science", dueDate: "2026-09-18", status: "pending" }
  ],
  resources: [
    { id: 1, title: "Physics Formula & Constant Sheet", url: "https://physics.info/constants/", subject: "Physics", label: "Cheat Sheet", notes: "Essential constants and kinematics equations" },
    { id: 2, title: "Calculus 1 Interactive Video Lectures", url: "https://www.khanacademy.org/math/calculus-1", subject: "Math", label: "Video Course", notes: "Covers derivatives, chain rule, and optimization" },
    { id: 3, title: "Modern European History Chronology", url: "https://www.worldhistory.org/timeline/", subject: "History", label: "Reference", notes: "Timeline of events 1789-1914" }
  ],
  studyLogs: [
    { date: "2026-09-02", hoursSpent: 3.0, tasksCompleted: 2 },
    { date: "2026-09-04", hoursSpent: 4.5, tasksCompleted: 4 },
    { date: "2026-09-06", hoursSpent: 2.0, tasksCompleted: 1 },
    { date: "2026-09-08", hoursSpent: 5.0, tasksCompleted: 5 },
    { date: "2026-09-10", hoursSpent: 3.5, tasksCompleted: 3 },
    { date: "2026-09-11", hoursSpent: 2.0, tasksCompleted: 2 },
    { date: "2026-09-12", hoursSpent: 2.5, tasksCompleted: 3 }
  ],
  quizHistory: [
    { id: 1, subject: "Math", difficulty: "Medium", score: 80, date: "2026-09-10" },
    { id: 2, subject: "Physics", difficulty: "Hard", score: 75, date: "2026-09-11" },
    { id: 3, subject: "Math", difficulty: "Medium", score: 90, date: "2026-09-12" }
  ]
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(PUBLIC_DIR));

// Helper: Read data from file or initialize
async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('data.json not found, initializing with default dataset...');
      await writeData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    console.error('Error reading data.json, falling back to default:', err.message);
    return DEFAULT_DATA;
  }
}

// Helper: Write data to file safely
async function writeData(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const tempFile = `${DATA_FILE}.tmp`;
  // Atomic write via temp file rename
  await fs.writeFile(tempFile, jsonString, 'utf8');
  await fs.rename(tempFile, DATA_FILE);
}

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    console.error('GET /api/data error:', error);
    res.status(500).json({ error: 'Failed to retrieve application data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const incomingData = req.body;
    if (!incomingData || typeof incomingData !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    // Ensure core collections exist
    const sanitizedData = {
      subjects: Array.isArray(incomingData.subjects) ? incomingData.subjects : [],
      subjectColors: incomingData.subjectColors && typeof incomingData.subjectColors === 'object' ? incomingData.subjectColors : {},
      assignments: Array.isArray(incomingData.assignments) ? incomingData.assignments : [],
      resources: Array.isArray(incomingData.resources) ? incomingData.resources : [],
      studyLogs: Array.isArray(incomingData.studyLogs) ? incomingData.studyLogs : [],
      quizHistory: Array.isArray(incomingData.quizHistory) ? incomingData.quizHistory : []
    };

    await writeData(sanitizedData);
    res.json({ success: true, message: 'Data saved successfully', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('POST /api/data error:', error);
    res.status(500).json({ error: 'Failed to save application data' });
  }
});

// Fallback SPA route
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` StudyFlow Server running at http://localhost:${PORT}`);
  console.log(` Static directory: ${PUBLIC_DIR}`);
  console.log(` Data file:       ${DATA_FILE}`);
  console.log(`====================================================`);
});
