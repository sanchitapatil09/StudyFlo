/**
 * StudyFlow - 3-Page Study Planner & Quiz Suite
 * Pure Vanilla JavaScript (ES6+) Application
 */

// ============================================================================
// 1. GLOBAL STATE & CONFIGURATION
// ============================================================================
const state = {
  subjects: [],
  subjectColors: {},
  assignments: [],
  resources: [],
  studyLogs: [],
  quizHistory: [],
  activePage: 'dashboard',
  assignmentFilter: 'all',
  assignmentSubjectFilter: 'all',
  assignmentSearchQuery: '',
  resourceSubjectFilter: 'all',
  resourceSearchQuery: '',
  editingAssignmentId: null
};

// Default fallback colors if not specified
const DEFAULT_PALETTE = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', 
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'
];

let consistencyChartInstance = null;

// ============================================================================
// 2. CURATED QUESTION BANK
// ============================================================================
const QUESTION_BANK = {
  Math: {
    "Calculus & Limits": [
      {
        q: "What is the derivative of f(x) = 3x^2 + 5x - 7?",
        options: ["6x + 5", "3x + 5", "6x - 7", "6x^2 + 5"],
        answer: 0,
        explanation: "Using the power rule d/dx(ax^n) = a*n*x^(n-1), d/dx(3x^2) = 6x, d/dx(5x) = 5, and d/dx(-7) = 0. Thus, 6x + 5."
      },
      {
        q: "Evaluate the limit: lim (x -> 0) [sin(x) / x].",
        options: ["0", "1", "Undefined", "Infinity"],
        answer: 1,
        explanation: "By standard calculus identity (or L'Hopital's rule: cos(x)/1 at x=0), lim(x->0) sin(x)/x = 1."
      },
      {
        q: "What is the integral of 2x dx?",
        options: ["x^2 + C", "2x^2 + C", "x + C", "2 + C"],
        answer: 0,
        explanation: "The antiderivative of 2x is 2 * (x^2 / 2) + C = x^2 + C."
      },
      {
        q: "If f'(x) > 0 for all x in an interval (a, b), the function f(x) is:",
        options: ["Strictly decreasing", "Strictly increasing", "Constant", "Concave down"],
        answer: 1,
        explanation: "A positive first derivative over an interval means the rate of change is positive, so the function is strictly increasing."
      },
      {
        q: "What is the value of d/dx [e^(2x)]?",
        options: ["e^(2x)", "2e^(2x)", "2xe^(2x)", "e^(x)"],
        answer: 1,
        explanation: "By chain rule, d/dx [e^(u)] = e^(u) * du/dx. Here u = 2x, so du/dx = 2. Result: 2e^(2x)."
      },
      {
        q: "What is the second derivative of f(x) = sin(x)?",
        options: ["cos(x)", "-sin(x)", "-cos(x)", "sin(x)"],
        answer: 1,
        explanation: "First derivative f'(x) = cos(x). Second derivative f''(x) = -sin(x)."
      },
      {
        q: "What is the integral of 1/x dx for x > 0?",
        options: ["ln(x) + C", "e^x + C", "-1/x^2 + C", "x + C"],
        answer: 0,
        explanation: "The antiderivative of 1/x for positive x is ln(x) + C."
      },
      {
        q: "A critical point of a differentiable function f(x) occurs when:",
        options: ["f(x) = 0", "f'(x) = 0 or undefined", "f''(x) > 0", "f'(x) = 1"],
        answer: 1,
        explanation: "Critical points are defined as domain values where the first derivative f'(x) is zero or undefined."
      }
    ],
    "Linear Algebra": [
      {
        q: "What is the determinant of a 2x2 matrix [[a, b], [c, d]]?",
        options: ["ad - bc", "ac - bd", "ad + bc", "ab - cd"],
        answer: 0,
        explanation: "By definition, the determinant of a 2x2 matrix is the product of the main diagonal minus the product of the off-diagonal: ad - bc."
      },
      {
        q: "If the determinant of a square matrix is 0, the matrix is:",
        options: ["Invertible", "Singular / Non-invertible", "Identity", "Orthogonal"],
        answer: 1,
        explanation: "A matrix with determinant 0 cannot be inverted and is termed singular."
      },
      {
        q: "Two non-zero vectors u and v are orthogonal if and only if:",
        options: ["u * v = 1", "u . v = 0", "u + v = 0", "|u| = |v|"],
        answer: 1,
        explanation: "Their dot product (inner product) is zero: u . v = 0."
      },
      {
        q: "What are the eigenvalues of an identity matrix of size 3x3?",
        options: ["All 0", "All 1", "1, 2, 3", "Undefined"],
        answer: 1,
        explanation: "Since I*v = 1*v for any vector, all eigenvalues of the identity matrix are 1."
      },
      {
        q: "The trace of a square matrix is equal to:",
        options: ["The product of diagonal entries", "The sum of diagonal entries", "The determinant", "The rank"],
        answer: 1,
        explanation: "The trace is defined as the sum of elements along the main diagonal."
      }
    ]
  },
  Physics: {
    "Mechanics & Motion": [
      {
        q: "What is the SI unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        answer: 2,
        explanation: "The SI unit of force is the Newton (N), equal to 1 kg*m/s^2."
      },
      {
        q: "Newton's Second Law states that force equals:",
        options: ["Mass divided by acceleration", "Mass times acceleration", "Velocity times time", "Momentum times speed"],
        answer: 1,
        explanation: "F = m * a (Force = mass * acceleration)."
      },
      {
        q: "What is the acceleration due to gravity near Earth's surface?",
        options: ["9.8 m/s^2", "8.9 m/s^2", "11.2 m/s^2", "6.67 m/s^2"],
        answer: 0,
        explanation: "Standard acceleration due to Earth's gravity (g) is approximately 9.80665 m/s^2."
      },
      {
        q: "Kinetic energy of an object of mass m moving with speed v is:",
        options: ["m * v", "0.5 * m * v^2", "m * g * h", "2 * m * v"],
        answer: 1,
        explanation: "Kinetic energy KE = 1/2 * m * v^2."
      },
      {
        q: "When no external net force acts on an isolated system, which quantity is conserved?",
        options: ["Total linear momentum", "Temperature", "Friction", "Acceleration"],
        answer: 0,
        explanation: "By Newton's third law and conservation laws, total linear momentum is conserved in the absence of net external force."
      },
      {
        q: "Work done on an object is defined as:",
        options: ["Force * Distance * cos(theta)", "Mass * Velocity", "Power * Acceleration", "Force / Time"],
        answer: 0,
        explanation: "Work W = F . d = F * d * cos(theta)."
      }
    ],
    "Electromagnetism": [
      {
        q: "Ohm's Law is expressed mathematically as:",
        options: ["V = I / R", "V = I * R", "P = V * I", "I = V * R"],
        answer: 1,
        explanation: "Voltage V = Current I * Resistance R."
      },
      {
        q: "What is the SI unit of electric charge?",
        options: ["Ampere", "Coulomb", "Volt", "Ohm"],
        answer: 1,
        explanation: "Electric charge is measured in Coulombs (C)."
      },
      {
        q: "Coulomb's Law describes the electrostatic force between two:",
        options: ["Point charges", "Magnetic poles", "Massive planets", "Current loops"],
        answer: 0,
        explanation: "Coulomb's Law states F = k * (|q1 * q2| / r^2) between two point charges."
      },
      {
        q: "Magnetic flux through a closed Gaussian surface is always:",
        options: ["Positive", "Zero", "Infinite", "Negative"],
        answer: 1,
        explanation: "Gauss's Law for magnetism states that there are no isolated magnetic monopoles, so net magnetic flux through any closed surface is zero."
      }
    ]
  },
  History: {
    "Modern World History": [
      {
        q: "In which year did the French Revolution begin?",
        options: ["1776", "1789", "1804", "1815"],
        answer: 1,
        explanation: "The French Revolution began in 1789 with the storming of the Bastille on July 14, 1789."
      },
      {
        q: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "Benjamin Franklin", "George Washington", "John Adams"],
        answer: 2,
        explanation: "George Washington served as the first U.S. President from 1789 to 1797."
      },
      {
        q: "Which conflict ended with the Treaty of Versailles in 1919?",
        options: ["World War I", "World War II", "The Crimean War", "The Napoleonic Wars"],
        answer: 0,
        explanation: "The Treaty of Versailles formally concluded World War I between Germany and the Allied Powers."
      },
      {
        q: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1950"],
        answer: 2,
        explanation: "World War II ended in 1945 with the surrender of Axis powers in Europe and the Pacific."
      },
      {
        q: "Which ancient civilization constructed the Colosseum?",
        options: ["Ancient Greece", "Roman Empire", "Persian Empire", "Ancient Egypt"],
        answer: 1,
        explanation: "The Colosseum in Rome was commissioned by Emperor Vespasian around 70-72 AD."
      }
    ]
  },
  "Computer Science": {
    "Algorithms & Data Structures": [
      {
        q: "What is the average time complexity of searching in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        explanation: "In a balanced BST, halving the search space at each node yields O(log n) average time complexity."
      },
      {
        q: "Which data structure follows the First-In, First-Out (FIFO) principle?",
        options: ["Stack", "Queue", "Priority Queue", "Heap"],
        answer: 1,
        explanation: "A Queue processes elements in FIFO order, whereas a Stack is LIFO (Last-In, First-Out)."
      },
      {
        q: "What is the worst-case time complexity of QuickSort?",
        options: ["O(log n)", "O(n log n)", "O(n^2)", "O(2^n)"],
        answer: 2,
        explanation: "When poorly partitioned (e.g., sorted array with first element as pivot), QuickSort degrades to O(n^2)."
      },
      {
        q: "Which algorithm is commonly used to find the shortest path in a weighted graph with non-negative edges?",
        options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Depth-First Search", "Binary Search"],
        answer: 0,
        explanation: "Dijkstra's algorithm efficiently computes single-source shortest paths for non-negative edge weights."
      },
      {
        q: "A Hash Table provides what expected time complexity for insertion and lookup?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        answer: 0,
        explanation: "With a uniform hash function and low load factor, hash table average operations run in O(1) constant time."
      }
    ]
  },
  Biology: {
    "Cellular Biology & Genetics": [
      {
        q: "Which organelle is widely known as the 'powerhouse of the cell'?",
        options: ["Ribosome", "Mitochondria", "Nucleus", "Endoplasmic Reticulum"],
        answer: 1,
        explanation: "Mitochondria produce the majority of ATP through cellular respiration, powering cellular tasks."
      },
      {
        q: "What are the four nucleotide bases found in DNA?",
        options: ["A, T, C, G", "A, U, C, G", "A, B, C, D", "T, U, G, P"],
        answer: 0,
        explanation: "DNA consists of Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). RNA uses Uracil (U) instead of Thymine."
      },
      {
        q: "The process by which green plants make food using sunlight is called:",
        options: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
        answer: 1,
        explanation: "Photosynthesis converts light energy, carbon dioxide, and water into glucose and oxygen."
      },
      {
        q: "In genetics, an organism with two identical alleles for a specific trait is called:",
        options: ["Heterozygous", "Homozygous", "Phenotype", "Recessive"],
        answer: 1,
        explanation: "Homozygous indicates having two identical alleles (e.g., AA or aa)."
      }
    ]
  }
};

// Generic fallback question generator if user selects a custom subject
function getFallbackQuestions(subjectName) {
  return [
    {
      q: `What is a fundamental foundational principle in ${subjectName}?`,
      options: [
        `Core theoretical framework and systematic analysis in ${subjectName}`,
        "Arbitrary guesswork without proof",
        "Passive memorization of unconnected facts",
        "Ignoring empirical observation"
      ],
      answer: 0,
      explanation: `Mastery in ${subjectName} begins with establishing clear foundational theories, definitions, and experimental evidence.`
    },
    {
      q: `Which study method is most effective when preparing for a ${subjectName} exam?`,
      options: [
        "Cramming 1 hour before the test",
        "Active recall and spaced retrieval practice",
        "Simply re-reading the textbook passively",
        "Skipping practice problems"
      ],
      answer: 1,
      explanation: "Cognitive science shows that active recall paired with spaced repetition produces the strongest long-term retention."
    },
    {
      q: `When analyzing complex problems in ${subjectName}, what should be the first step?`,
      options: [
        "Jump straight to the final answer",
        "Break down the problem into known parameters and constraints",
        "Skip the problem entirely",
        "Guess an intuitive number"
      ],
      answer: 1,
      explanation: "Deconstructing a problem into its knowns, unknowns, and constraints makes solving it structured and error-free."
    },
    {
      q: `How do synthesis and application enhance learning in ${subjectName}?`,
      options: [
        "They connect conceptual ideas to real-world problem scenarios",
        "They make the material completely obsolete",
        "They create confusion without benefit",
        "They are only useful for elementary concepts"
      ],
      answer: 0,
      explanation: "Higher-order thinking (Bloom's Taxonomy) focuses on synthesis and practical problem-solving to reinforce deep comprehension."
    },
    {
      q: `What role does error analysis play in ${subjectName} study sessions?`,
      options: [
        "Errors should be ignored immediately",
        "Identifying mistake causes prevents repeating identical errors",
        "Errors indicate you can never learn the topic",
        "Errors are irrelevant in modern education"
      ],
      answer: 1,
      explanation: "Examining why an answer was wrong turns mistakes into targeted learning opportunities."
    }
  ];
}

// ============================================================================
// 3. AUDIO SYNTHESIZER (WEB AUDIO API)
// ============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playUrgentBeep() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  playSuccessChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.1));
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + (idx * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (idx * 0.1) + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + (idx * 0.1));
        osc.stop(this.ctx.currentTime + (idx * 0.1) + 0.35);
      });
    } catch (e) {
      // Ignore audio error
    }
  }
}

const sounds = new SoundEffects();

// ============================================================================
// 4. THEME CONTROLLER
// ============================================================================
const ThemeController = {
  storageKey: 'studyflow_theme',

  init() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.applyTheme(initialTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Keyboard shortcut: Alt + T
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    
    const themeText = document.getElementById('theme-text');
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }

    // Update Chart.js styling if active
    if (consistencyChartInstance) {
      updateChartColors();
    }
  },

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme} mode`, 'info');
  }
};

const DEFAULT_SEED_DATA = {
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

function initDefaultLocalState() {
  state.subjects = DEFAULT_SEED_DATA.subjects.slice();
  state.subjectColors = Object.assign({}, DEFAULT_SEED_DATA.subjectColors);
  state.assignments = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA.assignments));
  state.resources = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA.resources));
  state.studyLogs = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA.studyLogs));
  state.quizHistory = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA.quizHistory));
}

// ============================================================================
// 5. DATA PERSISTENCE & API SYNC
// ============================================================================
async function fetchServerData() {
  setSyncStatus('syncing', 'Syncing...');
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    
    // Update local state
    state.subjects = Array.isArray(data.subjects) ? data.subjects : [];
    state.subjectColors = data.subjectColors || {};
    state.assignments = Array.isArray(data.assignments) ? data.assignments : [];
    state.resources = Array.isArray(data.resources) ? data.resources : [];
    state.studyLogs = Array.isArray(data.studyLogs) ? data.studyLogs : [];
    state.quizHistory = Array.isArray(data.quizHistory) ? data.quizHistory : [];

    // Ensure all subjects have color mappings
    state.subjects.forEach((subj, idx) => {
      if (!state.subjectColors[subj]) {
        state.subjectColors[subj] = DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
      }
    });

    // Cache to localStorage
    localStorage.setItem('studyflow_data', JSON.stringify(data));
    setSyncStatus('synced', 'Synced');
    renderAll();
  } catch (err) {
    console.warn('Fetch from server failed, falling back to local persistence:', err.message);
    const localData = localStorage.getItem('studyflow_data');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        state.subjects = parsed.subjects || [];
        state.subjectColors = parsed.subjectColors || {};
        state.assignments = parsed.assignments || [];
        state.resources = parsed.resources || [];
        state.studyLogs = parsed.studyLogs || [];
        state.quizHistory = parsed.quizHistory || [];
      } catch (e) {
        initDefaultLocalState();
      }
    } else {
      initDefaultLocalState();
    }
    setSyncStatus('error', 'Offline (Local)');
    renderAll();
  }
}

async function saveServerData() {
  setSyncStatus('syncing', 'Saving...');
  const payload = {
    subjects: state.subjects,
    subjectColors: state.subjectColors,
    assignments: state.assignments,
    resources: state.resources,
    studyLogs: state.studyLogs,
    quizHistory: state.quizHistory
  };

  // Always update local cache
  localStorage.setItem('studyflow_data', JSON.stringify(payload));

  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Save failed');
    setSyncStatus('synced', 'Saved');
  } catch (err) {
    console.warn('Server POST failed, saved to local cache:', err.message);
    setSyncStatus('error', 'Saved (Local)');
  }
}

function setSyncStatus(status, text) {
  const badge = document.getElementById('sync-status');
  if (!badge) return;
  badge.className = `sync-badge ${status}`;
  const label = badge.querySelector('.sync-label');
  if (label) label.textContent = text;
}

// ============================================================================
// 6. SPA NAVIGATION & ROUTING
// ============================================================================
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = btn.getAttribute('data-page');
      navigateTo(targetPage);
    });
  });

  // Handle URL hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'assignments', 'quiz'].includes(hash)) {
      navigateTo(hash, false);
    }
  });

  // Initial route
  const initialHash = window.location.hash.replace('#', '');
  if (['dashboard', 'assignments', 'quiz'].includes(initialHash)) {
    navigateTo(initialHash, false);
  } else {
    navigateTo('dashboard', false);
  }
}

function navigateTo(pageId, updateHash = true) {
  state.activePage = pageId;

  // Toggle active views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) targetView.classList.add('active');

  // Toggle active nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });

  if (updateHash) {
    window.location.hash = pageId;
  }

  // If entering dashboard, refresh chart layout
  if (pageId === 'dashboard') {
    setTimeout(() => {
      renderDashboard();
    }, 50);
  }
}

// ============================================================================
// 7. PAGE 1: DASHBOARD & CONSISTENCY TRACKER
// ============================================================================
function renderDashboard() {
  // Update date subtitle
  const dateSub = document.getElementById('dashboard-date-subtitle');
  if (dateSub) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateSub.textContent = `Today is ${today.toLocaleDateString(undefined, options)} — Keep up the focus!`;
  }

  // 1. Calculate Metrics
  const totalHours = state.studyLogs.reduce((acc, log) => acc + (parseFloat(log.hoursSpent) || 0), 0);
  const pendingCount = state.assignments.filter(a => a.status === 'pending').length;
  const completedCount = state.assignments.filter(a => a.status === 'completed').length;
  const totalAssignments = pendingCount + completedCount;
  const completionRate = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

  let avgQuizScore = 0;
  if (state.quizHistory.length > 0) {
    const totalQuizScore = state.quizHistory.reduce((acc, q) => acc + (parseFloat(q.score) || 0), 0);
    avgQuizScore = Math.round(totalQuizScore / state.quizHistory.length);
  }

  // Set Metric Card DOM Elements
  const elHours = document.getElementById('metric-total-hours');
  if (elHours) elHours.innerHTML = `${totalHours.toFixed(1)} <span class="metric-unit">hrs</span>`;

  const elPending = document.getElementById('metric-pending-count');
  if (elPending) elPending.textContent = pendingCount;

  const elCompleted = document.getElementById('metric-completed-count');
  if (elCompleted) elCompleted.textContent = completedCount;

  const elCompletedRate = document.getElementById('metric-completed-rate');
  if (elCompletedRate) elCompletedRate.textContent = `${completionRate}% overall completion`;

  const elAvgQuiz = document.getElementById('metric-avg-quiz');
  if (elAvgQuiz) elAvgQuiz.textContent = `${avgQuizScore}%`;

  const elQuizTotal = document.getElementById('metric-quiz-total');
  if (elQuizTotal) elQuizTotal.textContent = `Across ${state.quizHistory.length} quizzes taken`;

  // 2. Render Consistency Chart
  renderConsistencyChart();

  // 3. Render Subject Manager Chips
  renderSubjectChips();

  // 4. Update dropdowns across the application
  updateSubjectDropdowns();
}

function renderConsistencyChart() {
  const canvas = document.getElementById('consistencyChart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Prepare calendar dates for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const labels = [];
  const hoursData = [];
  const tasksData = [];

  // Map existing logs by 'YYYY-MM-DD'
  const logsMap = {};
  state.studyLogs.forEach(log => {
    logsMap[log.date] = log;
  });

  let activeDays = 0;
  let peakHours = 0;
  let totalHoursMonth = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    labels.push(`${month + 1}/${day}`);
    const log = logsMap[dateKey];
    if (log) {
      const h = parseFloat(log.hoursSpent) || 0;
      const t = parseInt(log.tasksCompleted, 10) || 0;
      hoursData.push(h);
      tasksData.push(t);
      if (h > 0 || t > 0) activeDays++;
      if (h > peakHours) peakHours = h;
      totalHoursMonth += h;
    } else {
      hoursData.push(0);
      tasksData.push(0);
    }
  }

  // Update footer statistics
  const statActive = document.getElementById('stat-active-days');
  if (statActive) statActive.textContent = `${activeDays} / ${daysInMonth}`;

  const statPeak = document.getElementById('stat-peak-hours');
  if (statPeak) statPeak.textContent = `${peakHours.toFixed(1)}h`;

  const statAvg = document.getElementById('stat-avg-hours');
  const avg = activeDays > 0 ? (totalHoursMonth / activeDays).toFixed(1) : '0.0';
  if (statAvg) statAvg.textContent = `${avg}h`;

  // Determine current theme colors
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  if (consistencyChartInstance) {
    consistencyChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  consistencyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Study Hours',
          data: hoursData,
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.85)' : 'rgba(79, 70, 229, 0.85)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Tasks Completed',
          data: tasksData,
          type: 'line',
          borderColor: isDark ? '#38bdf8' : '#0ea5e9',
          backgroundColor: isDark ? '#38bdf8' : '#0ea5e9',
          borderWidth: 2.5,
          pointBackgroundColor: isDark ? '#38bdf8' : '#0ea5e9',
          pointRadius: 3,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, maxTicksLimit: 16 }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Hours', color: textColor, font: { size: 11 } },
          grid: { color: gridColor },
          ticks: { color: textColor, stepSize: 1 },
          min: 0
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Tasks', color: textColor, font: { size: 11 } },
          grid: { drawOnChartArea: false },
          ticks: { color: textColor, stepSize: 1 },
          min: 0
        }
      }
    }
  });
}

function updateChartColors() {
  if (!consistencyChartInstance) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  consistencyChartInstance.options.scales.x.ticks.color = textColor;
  consistencyChartInstance.options.scales.y.ticks.color = textColor;
  consistencyChartInstance.options.scales.y.grid.color = gridColor;
  consistencyChartInstance.options.scales.y.title.color = textColor;
  consistencyChartInstance.options.scales.y1.ticks.color = textColor;
  consistencyChartInstance.options.scales.y1.title.color = textColor;
  consistencyChartInstance.update();
}

// Subject Manager
function renderSubjectChips() {
  const container = document.getElementById('subjects-chip-list');
  const countEl = document.getElementById('subject-count');
  if (!container) return;

  if (countEl) countEl.textContent = state.subjects.length;
  container.innerHTML = '';

  if (state.subjects.length === 0) {
    container.innerHTML = '<span class="text-muted" style="font-size:0.85rem">No subjects added yet.</span>';
    return;
  }

  state.subjects.forEach(subject => {
    const color = state.subjectColors[subject] || '#6366f1';
    const taskCount = state.assignments.filter(a => a.subject === subject).length;

    const chip = document.createElement('div');
    chip.className = 'subject-tag-chip';
    chip.innerHTML = `
      <span class="subject-color-indicator" style="background-color: ${color}"></span>
      <span>${escapeHtml(subject)}</span>
      <span class="subject-count-pill" title="${taskCount} assignments">${taskCount}</span>
      <button type="button" class="subject-del-btn" title="Delete ${escapeHtml(subject)}">&times;</button>
    `;

    chip.querySelector('.subject-del-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSubject(subject);
    });

    container.appendChild(chip);
  });
}

function deleteSubject(subjectName) {
  const linkedAssignments = state.assignments.filter(a => a.subject === subjectName).length;
  if (linkedAssignments > 0) {
    if (!confirm(`"${subjectName}" is used in ${linkedAssignments} assignments. Deleting it will keep the assignments but remove the tag. Proceed?`)) {
      return;
    }
  }

  state.subjects = state.subjects.filter(s => s !== subjectName);
  delete state.subjectColors[subjectName];
  saveServerData();
  renderAll();
  showToast(`Subject "${subjectName}" removed`, 'info');
}

function initSubjectManagerForm() {
  const form = document.getElementById('add-subject-form');
  const nameInput = document.getElementById('subject-name-input');
  const colorInput = document.getElementById('subject-color-input');
  const swatches = document.querySelectorAll('.color-swatch');

  if (!form) return;

  // Swatch selection
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const chosenColor = swatch.getAttribute('data-color');
      colorInput.value = chosenColor;
    });
  });

  colorInput.addEventListener('input', () => {
    swatches.forEach(s => s.classList.remove('active'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const color = colorInput.value;

    if (!name) return;

    if (state.subjects.some(s => s.toLowerCase() === name.toLowerCase())) {
      showToast('Subject with this name already exists!', 'error');
      return;
    }

    state.subjects.push(name);
    state.subjectColors[name] = color;

    saveServerData();
    renderAll();
    nameInput.value = '';
    showToast(`Added subject: ${name}`, 'success');
  });
}

function updateSubjectDropdowns() {
  const dropdownIds = [
    'assignment-subject-filter',
    'resource-subject-filter',
    'assignment-subject-input',
    'resource-subject-input',
    'quiz-subject-select'
  ];

  dropdownIds.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    const currentValue = select.value;
    const isFilter = id.includes('filter');

    let html = isFilter ? '<option value="all">All Subjects</option>' : '';

    state.subjects.forEach(subject => {
      html += `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`;
    });

    select.innerHTML = html;

    // Restore selected value if still exists
    if (currentValue && (currentValue === 'all' || state.subjects.includes(currentValue))) {
      select.value = currentValue;
    }
  });

  // Also trigger quiz topics update
  updateQuizTopics();
}

// ============================================================================
// 8. PAGE 2: ASSIGNMENT & RESOURCE HUB
// ============================================================================
function initHubEvents() {
  // Assignment filter tabs
  const tabs = document.querySelectorAll('#assignment-filter-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.assignmentFilter = tab.getAttribute('data-filter');
      renderAssignments();
    });
  });

  // Assignment search & subject filter
  const assignSearch = document.getElementById('assignment-search');
  if (assignSearch) {
    assignSearch.addEventListener('input', (e) => {
      state.assignmentSearchQuery = e.target.value.toLowerCase();
      renderAssignments();
    });
  }

  const assignSubjFilter = document.getElementById('assignment-subject-filter');
  if (assignSubjFilter) {
    assignSubjFilter.addEventListener('change', (e) => {
      state.assignmentSubjectFilter = e.target.value;
      renderAssignments();
    });
  }

  // Resource search & subject filter
  const resSearch = document.getElementById('resource-search');
  if (resSearch) {
    resSearch.addEventListener('input', (e) => {
      state.resourceSearchQuery = e.target.value.toLowerCase();
      renderResources();
    });
  }

  const resSubjFilter = document.getElementById('resource-subject-filter');
  if (resSubjFilter) {
    resSubjFilter.addEventListener('change', (e) => {
      state.resourceSubjectFilter = e.target.value;
      renderResources();
    });
  }

  // Modals trigger buttons
  document.getElementById('open-assignment-modal-btn')?.addEventListener('click', () => {
    openAssignmentModal();
  });
  document.getElementById('open-resource-modal-btn')?.addEventListener('click', () => {
    openResourceModal();
  });
  document.getElementById('open-study-modal-btn')?.addEventListener('click', () => {
    openStudyModal();
  });

  // Modal close buttons
  document.getElementById('close-assignment-modal-btn')?.addEventListener('click', closeModals);
  document.getElementById('cancel-assignment-btn')?.addEventListener('click', closeModals);
  document.getElementById('close-resource-modal-btn')?.addEventListener('click', closeModals);
  document.getElementById('cancel-resource-btn')?.addEventListener('click', closeModals);
  document.getElementById('close-study-modal-btn')?.addEventListener('click', closeModals);
  document.getElementById('cancel-study-btn')?.addEventListener('click', closeModals);

  // Forms submissions
  document.getElementById('assignment-form')?.addEventListener('submit', handleAssignmentSubmit);
  document.getElementById('resource-form')?.addEventListener('submit', handleResourceSubmit);
  document.getElementById('study-log-form')?.addEventListener('submit', handleStudyLogSubmit);
}

function renderAssignments() {
  const container = document.getElementById('assignment-list');
  const badgeTotal = document.getElementById('assignment-total-badge');
  if (!container) return;

  // Filter list
  let list = state.assignments.slice();

  // Status Filter
  if (state.assignmentFilter === 'pending') {
    list = list.filter(a => a.status === 'pending');
  } else if (state.assignmentFilter === 'completed') {
    list = list.filter(a => a.status === 'completed');
  }

  // Subject Filter
  if (state.assignmentSubjectFilter !== 'all') {
    list = list.filter(a => a.subject === state.assignmentSubjectFilter);
  }

  // Search Filter
  if (state.assignmentSearchQuery) {
    list = list.filter(a => a.title.toLowerCase().includes(state.assignmentSearchQuery));
  }

  // Sort by due date (ascending)
  list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (badgeTotal) badgeTotal.textContent = `${list.length} Shown`;

  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <p>No assignments found matching criteria.</p>
      </div>
    `;
    return;
  }

  const todayStr = getTodayString();

  list.forEach(assignment => {
    const isCompleted = assignment.status === 'completed';
    const subjColor = state.subjectColors[assignment.subject] || '#6366f1';

    // Calculate due urgency
    let dueClass = 'due-upcoming';
    let dueText = assignment.dueDate;
    if (assignment.dueDate < todayStr && !isCompleted) {
      dueClass = 'due-overdue';
      dueText = `Overdue (${assignment.dueDate})`;
    } else if (assignment.dueDate === todayStr && !isCompleted) {
      dueClass = 'due-today';
      dueText = `Due Today!`;
    }

    const item = document.createElement('div');
    item.className = `assignment-item ${isCompleted ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="assignment-left">
        <div class="custom-checkbox ${isCompleted ? 'checked' : ''}" title="Toggle status">
          ${isCompleted ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
        </div>
        <div class="assignment-details">
          <div class="assignment-title">${escapeHtml(assignment.title)}</div>
          <div class="assignment-meta">
            <span class="meta-chip" style="background-color: ${subjColor}20; color: ${subjColor}">
              <span style="width:6px; height:6px; border-radius:50%; background-color:${subjColor}"></span>
              ${escapeHtml(assignment.subject)}
            </span>
            <span class="due-chip ${dueClass}">${dueText}</span>
          </div>
        </div>
      </div>
      <div class="assignment-actions">
        <button class="btn-icon edit-btn" title="Edit Assignment">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button class="btn-icon danger delete-btn" title="Delete Assignment">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;

    // Toggle complete
    item.querySelector('.custom-checkbox').addEventListener('click', () => {
      toggleAssignmentStatus(assignment.id);
    });

    // Edit
    item.querySelector('.edit-btn').addEventListener('click', () => {
      openAssignmentModal(assignment);
    });

    // Delete
    item.querySelector('.delete-btn').addEventListener('click', () => {
      deleteAssignment(assignment.id);
    });

    container.appendChild(item);
  });
}

function toggleAssignmentStatus(id) {
  const item = state.assignments.find(a => a.id === id);
  if (!item) return;

  item.status = item.status === 'completed' ? 'pending' : 'completed';

  // If newly completed, increment today's study task count in studyLogs!
  if (item.status === 'completed') {
    const today = getTodayString();
    let log = state.studyLogs.find(l => l.date === today);
    if (log) {
      log.tasksCompleted = (parseInt(log.tasksCompleted, 10) || 0) + 1;
    } else {
      state.studyLogs.push({ date: today, hoursSpent: 0.5, tasksCompleted: 1 });
    }
    showToast(`Completed: ${item.title}`, 'success');
  } else {
    showToast(`Marked pending: ${item.title}`, 'info');
  }

  saveServerData();
  renderAll();
}

function deleteAssignment(id) {
  if (!confirm('Are you sure you want to delete this assignment?')) return;
  state.assignments = state.assignments.filter(a => a.id !== id);
  saveServerData();
  renderAll();
  showToast('Assignment deleted', 'info');
}

function openAssignmentModal(assignmentToEdit = null) {
  const modal = document.getElementById('assignment-modal');
  const title = document.getElementById('assignment-modal-title');
  const editIdInput = document.getElementById('assignment-edit-id');
  const titleInput = document.getElementById('assignment-title-input');
  const subjectInput = document.getElementById('assignment-subject-input');
  const dueInput = document.getElementById('assignment-due-input');
  const statusInput = document.getElementById('assignment-status-input');

  if (state.subjects.length === 0) {
    showToast('Please create at least one subject first!', 'error');
    return;
  }

  updateSubjectDropdowns();

  if (assignmentToEdit) {
    title.textContent = 'Edit Assignment';
    editIdInput.value = assignmentToEdit.id;
    titleInput.value = assignmentToEdit.title;
    subjectInput.value = assignmentToEdit.subject;
    dueInput.value = assignmentToEdit.dueDate;
    statusInput.value = assignmentToEdit.status;
  } else {
    title.textContent = 'Create New Assignment';
    editIdInput.value = '';
    titleInput.value = '';
    subjectInput.value = state.subjects[0] || '';
    dueInput.value = getTodayString();
    statusInput.value = 'pending';
  }

  modal.classList.remove('hidden');
  titleInput.focus();
}

function handleAssignmentSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('assignment-edit-id').value;
  const title = document.getElementById('assignment-title-input').value.trim();
  const subject = document.getElementById('assignment-subject-input').value;
  const dueDate = document.getElementById('assignment-due-input').value;
  const status = document.getElementById('assignment-status-input').value;

  if (!title || !subject || !dueDate) return;

  if (editId) {
    // Update existing
    const existing = state.assignments.find(a => a.id === parseInt(editId, 10));
    if (existing) {
      existing.title = title;
      existing.subject = subject;
      existing.dueDate = dueDate;
      existing.status = status;
      showToast('Assignment updated', 'success');
    }
  } else {
    // Add new
    const nextId = state.assignments.length > 0 ? Math.max(...state.assignments.map(a => a.id)) + 1 : 1;
    state.assignments.push({
      id: nextId,
      title,
      subject,
      dueDate,
      status
    });
    showToast('Assignment created', 'success');
  }

  closeModals();
  saveServerData();
  renderAll();
}

// Resource Vault
function renderResources() {
  const container = document.getElementById('resource-list');
  const badgeTotal = document.getElementById('resource-total-badge');
  if (!container) return;

  let list = state.resources.slice();

  if (state.resourceSubjectFilter !== 'all') {
    list = list.filter(r => r.subject === state.resourceSubjectFilter);
  }

  if (state.resourceSearchQuery) {
    const q = state.resourceSearchQuery;
    list = list.filter(r => 
      r.title.toLowerCase().includes(q) || 
      (r.notes && r.notes.toLowerCase().includes(q)) ||
      (r.label && r.label.toLowerCase().includes(q))
    );
  }

  if (badgeTotal) badgeTotal.textContent = `${list.length} Resources`;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>No resources saved for this subject.</p>
      </div>
    `;
    return;
  }

  list.forEach(res => {
    const subjColor = state.subjectColors[res.subject] || '#6366f1';
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <div class="resource-top">
        <div class="resource-title">${escapeHtml(res.title)}</div>
        <div class="resource-badges">
          <span class="meta-chip" style="background-color: ${subjColor}20; color: ${subjColor}">${escapeHtml(res.subject)}</span>
          <span class="resource-label-tag">${escapeHtml(res.label || 'Reference')}</span>
        </div>
      </div>
      ${res.notes ? `<div class="resource-notes">${escapeHtml(res.notes)}</div>` : ''}
      <div class="resource-link-row">
        <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener noreferrer" class="resource-url-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <span>${escapeHtml(res.url)}</span>
        </a>
        <div class="resource-actions">
          <button class="btn-icon copy-btn" title="Copy Link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <button class="btn-icon danger delete-btn" title="Delete Resource">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    `;

    // Copy link
    card.querySelector('.copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(res.url);
      showToast('Resource link copied to clipboard!', 'info');
    });

    // Delete
    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteResource(res.id);
    });

    container.appendChild(card);
  });
}

function deleteResource(id) {
  if (!confirm('Delete this resource?')) return;
  state.resources = state.resources.filter(r => r.id !== id);
  saveServerData();
  renderResources();
  showToast('Resource removed', 'info');
}

function openResourceModal() {
  if (state.subjects.length === 0) {
    showToast('Please create at least one subject first!', 'error');
    return;
  }
  updateSubjectDropdowns();
  document.getElementById('resource-form').reset();
  document.getElementById('resource-modal').classList.remove('hidden');
  document.getElementById('resource-title-input').focus();
}

function handleResourceSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('resource-title-input').value.trim();
  const subject = document.getElementById('resource-subject-input').value;
  const label = document.getElementById('resource-label-input').value;
  const url = document.getElementById('resource-url-input').value.trim();
  const notes = document.getElementById('resource-notes-input').value.trim();

  if (!title || !subject || !url) return;

  const nextId = state.resources.length > 0 ? Math.max(...state.resources.map(r => r.id)) + 1 : 1;
  state.resources.push({
    id: nextId,
    title,
    subject,
    label,
    url,
    notes
  });

  closeModals();
  saveServerData();
  renderResources();
  showToast('Resource added to vault', 'success');
}

// Log Study Session Modal
function openStudyModal() {
  document.getElementById('study-date-input').value = getTodayString();
  document.getElementById('study-hours-input').value = '2.0';
  document.getElementById('study-tasks-input').value = '3';
  document.getElementById('study-modal').classList.remove('hidden');
}

function handleStudyLogSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('study-date-input').value;
  const hoursSpent = parseFloat(document.getElementById('study-hours-input').value) || 0;
  const tasksCompleted = parseInt(document.getElementById('study-tasks-input').value, 10) || 0;

  if (!date || hoursSpent <= 0) return;

  let existing = state.studyLogs.find(l => l.date === date);
  if (existing) {
    existing.hoursSpent = parseFloat((existing.hoursSpent + hoursSpent).toFixed(2));
    existing.tasksCompleted = (existing.tasksCompleted || 0) + tasksCompleted;
  } else {
    state.studyLogs.push({ date, hoursSpent, tasksCompleted });
  }

  closeModals();
  saveServerData();
  renderAll();
  showToast(`Logged ${hoursSpent}h on ${date}!`, 'success');
}

function closeModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
}

// ============================================================================
// 9. PAGE 3: QUIZ CENTER & DIGITAL TIMER ENGINE
// ============================================================================
const QuizEngine = {
  activeQuiz: null,
  timerInterval: null,

  init() {
    const form = document.getElementById('quiz-config-form');
    const subjSelect = document.getElementById('quiz-subject-select');
    const diffRadios = document.querySelectorAll('input[name="difficulty"]');
    const countSelect = document.getElementById('quiz-question-count');

    subjSelect?.addEventListener('change', () => {
      updateQuizTopics();
      this.updateConfigSummary();
    });

    diffRadios.forEach(radio => {
      radio.addEventListener('change', () => this.updateConfigSummary());
    });

    countSelect?.addEventListener('change', () => this.updateConfigSummary());

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.startQuiz();
    });

    // Active Quiz Controls
    document.getElementById('quiz-prev-btn')?.addEventListener('click', () => this.prevQuestion());
    document.getElementById('quiz-next-btn')?.addEventListener('click', () => this.nextQuestion());
    document.getElementById('quiz-submit-btn')?.addEventListener('click', () => this.submitQuiz());
    document.getElementById('quiz-cancel-btn')?.addEventListener('click', () => this.cancelQuiz());

    // Results Actions
    document.getElementById('res-retake-btn')?.addEventListener('click', () => {
      this.showSubview('quiz-config-view');
      this.renderHistory();
    });

    document.getElementById('res-goto-dashboard-btn')?.addEventListener('click', () => {
      this.showSubview('quiz-config-view');
      navigateTo('dashboard');
    });

    this.updateConfigSummary();
    this.renderHistory();
  },

  showSubview(subviewId) {
    document.querySelectorAll('.quiz-subview').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(subviewId);
    if (target) target.classList.remove('hidden');
  },

  updateConfigSummary() {
    const diff = document.querySelector('input[name="difficulty"]:checked')?.value || 'Easy';
    const count = parseInt(document.getElementById('quiz-question-count')?.value || '5', 10);
    const secPerQ = diff === 'Easy' ? 60 : (diff === 'Medium' ? 45 : 30);
    const totalSec = secPerQ * count;
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const estEl = document.getElementById('config-time-estimate');
    if (estEl) {
      estEl.textContent = `${mins} min ${secs > 0 ? secs + ' sec' : ''}`;
    }
  },

  startQuiz() {
    sounds.init();
    const subject = document.getElementById('quiz-subject-select').value;
    const topic = document.getElementById('quiz-topic-select').value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const count = parseInt(document.getElementById('quiz-question-count').value, 10);

    if (!subject) {
      showToast('Please select a subject first!', 'error');
      return;
    }

    // Retrieve questions
    let questions = [];
    if (QUESTION_BANK[subject] && QUESTION_BANK[subject][topic]) {
      questions = QUESTION_BANK[subject][topic].slice();
    } else if (QUESTION_BANK[subject]) {
      // Pick all questions in subject
      Object.values(QUESTION_BANK[subject]).forEach(arr => {
        questions.push(...arr);
      });
    }

    // Fallback if not enough questions in bank
    if (questions.length === 0) {
      questions = getFallbackQuestions(subject);
    }

    // Shuffle & slice to requested count
    questions = shuffleArray(questions).slice(0, count);

    // Calculate time in seconds
    const timePerQ = difficulty === 'Easy' ? 60 : (difficulty === 'Medium' ? 45 : 30);
    const totalTimeSec = timePerQ * questions.length;

    this.activeQuiz = {
      subject,
      topic,
      difficulty,
      questions,
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      totalSeconds: totalTimeSec,
      remainingSeconds: totalTimeSec,
      startTime: Date.now()
    };

    // Prepare active view
    document.getElementById('active-quiz-subject').textContent = subject;
    document.getElementById('active-quiz-topic').textContent = topic;
    document.getElementById('active-quiz-difficulty').textContent = `${difficulty} (${timePerQ}s/q)`;

    this.showSubview('quiz-active-view');
    this.renderCurrentQuestion();
    this.startTimer();
  },

  startTimer() {
    clearInterval(this.timerInterval);
    const timerContainer = document.getElementById('timer-container');
    const clock = document.getElementById('quiz-timer-clock');

    this.updateClockDisplay();

    this.timerInterval = setInterval(() => {
      if (!this.activeQuiz) {
        clearInterval(this.timerInterval);
        return;
      }

      this.activeQuiz.remainingSeconds--;

      // Warning State (< 10 seconds)
      if (this.activeQuiz.remainingSeconds <= 10 && this.activeQuiz.remainingSeconds > 0) {
        timerContainer.classList.add('warning');
        sounds.playUrgentBeep();
      } else {
        timerContainer.classList.remove('warning');
      }

      this.updateClockDisplay();

      // AUTO-SUBMIT at 00:00
      if (this.activeQuiz.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        timerContainer.classList.remove('warning');
        showToast('Time expired! Auto-submitting quiz...', 'error');
        this.submitQuiz(true);
      }
    }, 1000);
  },

  updateClockDisplay() {
    const clock = document.getElementById('quiz-timer-clock');
    if (!clock || !this.activeQuiz) return;
    const sec = Math.max(0, this.activeQuiz.remainingSeconds);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    clock.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  renderCurrentQuestion() {
    if (!this.activeQuiz) return;
    const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
    const total = this.activeQuiz.questions.length;
    const curr = this.activeQuiz.currentIndex + 1;

    // Trackers
    document.getElementById('q-number-pill').textContent = `Question ${curr} of ${total}`;
    document.getElementById('quiz-q-tracker').textContent = `Question ${curr} of ${total}`;

    const answeredCount = this.activeQuiz.answers.filter(a => a !== null).length;
    document.getElementById('quiz-answered-count').textContent = `${answeredCount} of ${total} answered`;

    // Progress bar
    const percent = Math.round((curr / total) * 100);
    document.getElementById('quiz-progress-fill').style.width = `${percent}%`;

    // Prompt
    document.getElementById('question-text').textContent = q.q;

    // Options
    const optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';

    const alphabet = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, idx) => {
      const isSelected = this.activeQuiz.answers[this.activeQuiz.currentIndex] === idx;
      const card = document.createElement('div');
      card.className = `option-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="option-indicator">${alphabet[idx]}</div>
        <div class="option-text">${escapeHtml(optText)}</div>
      `;

      card.addEventListener('click', () => {
        this.activeQuiz.answers[this.activeQuiz.currentIndex] = idx;
        this.renderCurrentQuestion();
      });

      optContainer.appendChild(card);
    });

    // Control buttons state
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const submitBtn = document.getElementById('quiz-submit-btn');

    prevBtn.disabled = this.activeQuiz.currentIndex === 0;

    if (curr === total) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  },

  prevQuestion() {
    if (!this.activeQuiz || this.activeQuiz.currentIndex <= 0) return;
    this.activeQuiz.currentIndex--;
    this.renderCurrentQuestion();
  },

  nextQuestion() {
    if (!this.activeQuiz || this.activeQuiz.currentIndex >= this.activeQuiz.questions.length - 1) return;
    this.activeQuiz.currentIndex++;
    this.renderCurrentQuestion();
  },

  cancelQuiz() {
    if (!confirm('Quit this quiz? Progress will not be saved.')) return;
    clearInterval(this.timerInterval);
    this.activeQuiz = null;
    document.getElementById('timer-container').classList.remove('warning');
    this.showSubview('quiz-config-view');
    showToast('Quiz cancelled', 'info');
  },

  submitQuiz(isAuto = false) {
    if (!this.activeQuiz) return;

    if (!isAuto) {
      const unanswered = this.activeQuiz.answers.filter(a => a === null).length;
      if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
          return;
        }
      }
    }

    clearInterval(this.timerInterval);
    document.getElementById('timer-container').classList.remove('warning');

    const totalQuestions = this.activeQuiz.questions.length;
    let correctCount = 0;

    this.activeQuiz.questions.forEach((q, idx) => {
      const userAns = this.activeQuiz.answers[idx];
      if (userAns !== null && userAns === q.answer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const timeSpentSeconds = Math.max(1, this.activeQuiz.totalSeconds - this.activeQuiz.remainingSeconds);
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;
    const timeSpentFormatted = `${mins}m ${secs}s`;

    // Record into quizHistory
    const today = getTodayString();
    const nextQuizId = state.quizHistory.length > 0 ? Math.max(...state.quizHistory.map(q => q.id)) + 1 : 1;
    const quizRecord = {
      id: nextQuizId,
      subject: this.activeQuiz.subject,
      difficulty: this.activeQuiz.difficulty,
      score: scorePercentage,
      date: today
    };
    state.quizHistory.unshift(quizRecord);

    // Auto-log into consistency tracker studyLogs
    const studyHoursEquiv = parseFloat((timeSpentSeconds / 3600 + 0.25).toFixed(2)); // quiz + reflection credit
    let todayLog = state.studyLogs.find(l => l.date === today);
    if (todayLog) {
      todayLog.hoursSpent = parseFloat((todayLog.hoursSpent + studyHoursEquiv).toFixed(2));
      todayLog.tasksCompleted = (todayLog.tasksCompleted || 0) + 1;
    } else {
      state.studyLogs.push({
        date: today,
        hoursSpent: studyHoursEquiv,
        tasksCompleted: 1
      });
    }

    // Save to server
    saveServerData();

    // Render Results View
    this.renderResults({
      scorePercentage,
      correctCount,
      totalQuestions,
      timeSpentFormatted,
      subject: this.activeQuiz.subject,
      difficulty: this.activeQuiz.difficulty,
      questions: this.activeQuiz.questions,
      userAnswers: this.activeQuiz.answers
    });

    sounds.playSuccessChime();
    this.activeQuiz = null;
  },

  renderResults(res) {
    this.showSubview('quiz-results-view');

    // Score Circle
    const pctEl = document.getElementById('result-percentage');
    const fracEl = document.getElementById('result-fraction');
    const circle = document.getElementById('result-score-circle');
    
    pctEl.textContent = `${res.scorePercentage}%`;
    fracEl.textContent = `${res.correctCount} / ${res.totalQuestions}`;

    if (res.scorePercentage >= 80) {
      circle.style.borderColor = 'var(--success)';
      document.getElementById('result-feedback-badge').textContent = 'Top Performer';
      document.getElementById('result-feedback-title').textContent = 'Outstanding Work!';
      document.getElementById('result-feedback-desc').textContent = 'You have demonstrated strong grasp of these concepts.';
    } else if (res.scorePercentage >= 60) {
      circle.style.borderColor = 'var(--warning)';
      document.getElementById('result-feedback-badge').textContent = 'Satisfactory';
      document.getElementById('result-feedback-title').textContent = 'Good Effort!';
      document.getElementById('result-feedback-desc').textContent = 'A solid attempt. Review the explanations below to refine weak points.';
    } else {
      circle.style.borderColor = 'var(--danger)';
      document.getElementById('result-feedback-badge').textContent = 'Needs Review';
      document.getElementById('result-feedback-title').textContent = 'Keep Practicing!';
      document.getElementById('result-feedback-desc').textContent = 'Review the detailed answer breakdown below and retry after studying.';
    }

    document.getElementById('result-subject').textContent = res.subject;
    document.getElementById('result-diff').textContent = res.difficulty;
    document.getElementById('result-time-spent').textContent = res.timeSpentFormatted;

    // Detailed Question Analysis Breakdown
    const analysisList = document.getElementById('analysis-list');
    analysisList.innerHTML = '';

    res.questions.forEach((q, idx) => {
      const userChoice = res.userAnswers[idx];
      const isCorrect = userChoice === q.answer;
      const card = document.createElement('div');
      card.className = `analysis-card ${isCorrect ? 'correct' : 'incorrect'}`;

      const userChoiceText = userChoice !== null ? q.options[userChoice] : 'Unanswered';
      const correctChoiceText = q.options[q.answer];

      card.innerHTML = `
        <div class="analysis-q-header">
          <div class="analysis-q-title">Q${idx + 1}: ${escapeHtml(q.q)}</div>
          <span class="analysis-badge ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
          </span>
        </div>
        <div class="analysis-answers">
          <div class="ans-row">
            <span class="ans-label">Your Answer:</span>
            <span class="ans-text ${isCorrect ? 'correct-ans' : 'wrong-ans'}">${escapeHtml(userChoiceText)}</span>
          </div>
          ${!isCorrect ? `
          <div class="ans-row">
            <span class="ans-label">Correct Answer:</span>
            <span class="ans-text correct-ans">${escapeHtml(correctChoiceText)}</span>
          </div>` : ''}
        </div>
        <div class="analysis-explanation">
          <strong>Key Takeaway:</strong> ${escapeHtml(q.explanation)}
        </div>
      `;

      analysisList.appendChild(card);
    });

    this.renderHistory();
  },

  renderHistory() {
    const container = document.getElementById('quiz-history-list');
    const countBadge = document.getElementById('quiz-history-count');
    if (!container) return;

    if (countBadge) countBadge.textContent = `${state.quizHistory.length} Recorded`;
    container.innerHTML = '';

    if (state.quizHistory.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No quizzes completed yet. Launch your first test above!</p>
        </div>
      `;
      return;
    }

    state.quizHistory.slice(0, 8).forEach(item => {
      const subjColor = state.subjectColors[item.subject] || '#6366f1';
      const scoreColor = item.score >= 80 ? 'var(--success)' : (item.score >= 60 ? 'var(--warning)' : 'var(--danger)');

      const div = document.createElement('div');
      div.className = 'quiz-history-item';
      div.innerHTML = `
        <div class="qh-info">
          <span class="qh-subject">${escapeHtml(item.subject)}</span>
          <div class="qh-meta">
            <span style="color: ${subjColor}; font-weight:700;">${escapeHtml(item.difficulty || 'Medium')}</span>
            <span>•</span>
            <span>${item.date}</span>
          </div>
        </div>
        <div class="qh-score" style="color: ${scoreColor}">${item.score}%</div>
      `;
      container.appendChild(div);
    });
  }
};

function updateQuizTopics() {
  const subjSelect = document.getElementById('quiz-subject-select');
  const topicSelect = document.getElementById('quiz-topic-select');
  if (!subjSelect || !topicSelect) return;

  const currentSubject = subjSelect.value;
  topicSelect.innerHTML = '';

  if (QUESTION_BANK[currentSubject]) {
    const topics = Object.keys(QUESTION_BANK[currentSubject]);
    topics.forEach(t => {
      topicSelect.innerHTML += `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`;
    });
  } else {
    topicSelect.innerHTML = `<option value="Core Fundamentals">Core Fundamentals</option>`;
  }
}

// ============================================================================
// 10. UTILITIES & HELPERS
// ============================================================================
function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">
      ${type === 'success' ? '✓' : (type === 'error' ? '⚠' : 'ℹ')}
    </span>
    <span class="toast-text">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Global master re-render
function renderAll() {
  renderDashboard();
  renderAssignments();
  renderResources();
  QuizEngine.renderHistory();
}

// ============================================================================
// 11. APPLICATION INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeController.init();
  initNavigation();
  initSubjectManagerForm();
  initHubEvents();
  QuizEngine.init();

  // Load backend state
  fetchServerData();
});
