// GlobeTrotter Backend - Node.js/Express Server
// Run: npm install express cors bcryptjs jsonwebtoken sqlite3
// Start: node server.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

const corsOptions = {
  origin: [
    "https://globetrotter-atomic.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your-secret-key-change-in-production";


// Initialize SQLite Database
const db = new sqlite3.Database('./globetrotter.db', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Trips table
  db.run(`CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_photo TEXT,
    is_public BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Stops table (cities in itinerary)
  db.run(`CREATE TABLE IF NOT EXISTS stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    city_name TEXT NOT NULL,
    country TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stop_order INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
  )`);

  // Activities table
  db.run(`CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stop_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    cost REAL DEFAULT 0,
    duration INTEGER,
    activity_date DATE,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
  )`);

  // Cities master data
  db.run(`CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT,
    cost_index INTEGER DEFAULT 5,
    popularity INTEGER DEFAULT 0,
    description TEXT
  )`);

  // Insert sample cities
  const cities = [
    ['Paris', 'France', 'Europe', 8, 95, 'City of Light and Romance'],
    ['Tokyo', 'Japan', 'Asia', 9, 90, 'Modern metropolis with ancient traditions'],
    ['New York', 'USA', 'North America', 9, 88, 'The city that never sleeps'],
    ['London', 'UK', 'Europe', 9, 92, 'Historic capital with royal heritage'],
    ['Barcelona', 'Spain', 'Europe', 7, 85, 'Mediterranean beauty with Gaudi architecture'],
    ['Rome', 'Italy', 'Europe', 7, 89, 'Eternal city of history and culture'],
    ['Dubai', 'UAE', 'Middle East', 8, 80, 'Modern oasis of luxury'],
    ['Bali', 'Indonesia', 'Asia', 5, 87, 'Tropical paradise'],
    ['Iceland', 'Iceland', 'Europe', 9, 75, 'Land of fire and ice'],
    ['Sydney', 'Australia', 'Oceania', 8, 82, 'Harbor city with iconic landmarks']
  ];

  db.get('SELECT COUNT(*) as count FROM cities', (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare('INSERT INTO cities (name, country, region, cost_index, popularity, description) VALUES (?, ?, ?, ?, ?, ?)');
      cities.forEach(city => stmt.run(city));
      stmt.finalize();
    }
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// AUTH ROUTES
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Server error' });
      }

      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: this.lastID, name, email } });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  });
});

// TRIP ROUTES
app.get('/api/trips', authenticateToken, (req, res) => {
  db.all('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, trips) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(trips);
    }
  );
});

app.post('/api/trips', authenticateToken, (req, res) => {
  const { name, description, start_date, end_date, cover_photo } = req.body;

  db.run('INSERT INTO trips (user_id, name, description, start_date, end_date, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, name, description, start_date, end_date, cover_photo],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ id: this.lastID, ...req.body, user_id: req.user.id });
    }
  );
});

app.get('/api/trips/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM trips WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err, trip) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });
      res.json(trip);
    }
  );
});

app.put('/api/trips/:id', authenticateToken, (req, res) => {
  const { name, description, start_date, end_date, cover_photo, is_public } = req.body;

  db.run('UPDATE trips SET name = ?, description = ?, start_date = ?, end_date = ?, cover_photo = ?, is_public = ? WHERE id = ? AND user_id = ?',
    [name, description, start_date, end_date, cover_photo, is_public, req.params.id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Trip not found' });
      res.json({ message: 'Trip updated' });
    }
  );
});

app.delete('/api/trips/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM trips WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Trip not found' });
      res.json({ message: 'Trip deleted' });
    }
  );
});

// STOPS ROUTES
app.get('/api/trips/:tripId/stops', authenticateToken, (req, res) => {
  db.all('SELECT s.* FROM stops s JOIN trips t ON s.trip_id = t.id WHERE t.id = ? AND t.user_id = ? ORDER BY s.stop_order',
    [req.params.tripId, req.user.id],
    (err, stops) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(stops);
    }
  );
});

app.post('/api/trips/:tripId/stops', authenticateToken, (req, res) => {
  const { city_name, country, start_date, end_date, stop_order, notes } = req.body;

  db.run('INSERT INTO stops (trip_id, city_name, country, start_date, end_date, stop_order, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.params.tripId, city_name, country, start_date, end_date, stop_order, notes],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ id: this.lastID, ...req.body, trip_id: req.params.tripId });
    }
  );
});

app.delete('/api/stops/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM stops WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ message: 'Stop deleted' });
  });
});

// ACTIVITIES ROUTES
app.get('/api/stops/:stopId/activities', authenticateToken, (req, res) => {
  db.all('SELECT * FROM activities WHERE stop_id = ? ORDER BY activity_date',
    [req.params.stopId],
    (err, activities) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(activities);
    }
  );
});

app.post('/api/stops/:stopId/activities', authenticateToken, (req, res) => {
  const { name, description, category, cost, duration, activity_date } = req.body;

  db.run('INSERT INTO activities (stop_id, name, description, category, cost, duration, activity_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.params.stopId, name, description, category, cost, duration, activity_date],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ id: this.lastID, ...req.body, stop_id: req.params.stopId });
    }
  );
});

app.delete('/api/activities/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM activities WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ message: 'Activity deleted' });
  });
});

// CITIES ROUTES
app.get('/api/cities', (req, res) => {
  const { search, country } = req.query;
  let query = 'SELECT * FROM cities WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR country LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (country) {
    query += ' AND country = ?';
    params.push(country);
  }

  query += ' ORDER BY popularity DESC LIMIT 50';

  db.all(query, params, (err, cities) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(cities);
  });
});

// BUDGET CALCULATION
app.get('/api/trips/:tripId/budget', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      SUM(a.cost) as total_activities,
      COUNT(DISTINCT s.id) as total_stops
    FROM trips t
    LEFT JOIN stops s ON t.id = s.trip_id
    LEFT JOIN activities a ON s.id = a.stop_id
    WHERE t.id = ? AND t.user_id = ?
    GROUP BY t.id
  `;

  db.get(query, [req.params.tripId, req.user.id], (err, budget) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    
    const totalActivities = budget?.total_activities || 0;
    const totalStops = budget?.total_stops || 0;
    const estimatedAccommodation = totalStops * 100;
    const estimatedTransport = totalStops * 50;
    const estimatedMeals = totalStops * 75;

    res.json({
      activities: totalActivities,
      accommodation: estimatedAccommodation,
      transport: estimatedTransport,
      meals: estimatedMeals,
      total: totalActivities + estimatedAccommodation + estimatedTransport + estimatedMeals
    });
  });
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json(user);
    }
  );
});


app.get("/", (req, res) => {
  res.send("GlobeTrotter backend is running");
});
 

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
  

app.listen(PORT, () => {
  console.log(`GlobeTrotter server running on port ${PORT}`);
});
