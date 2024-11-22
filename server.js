const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the School Management API!');
});

// Middleware to parse JSON
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;
  
    // Validate the input
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Insert into the database
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const values = [name, address, latitude, longitude];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Failed to add school' });
      }
  
      res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
  });
  
  app.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;
  
    // Validate the input
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
  
    // Query to calculate distance and sort by proximity
    const query = `
      SELECT id, name, address, latitude, longitude,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )) AS distance
      FROM schools
      ORDER BY distance ASC
    `;
    const values = [latitude, longitude, latitude];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error fetching schools:', err);
        return res.status(500).json({ error: 'Failed to retrieve schools' });
      }
  
      res.json(results);
    });
  });
  

// Routes (Keep your previously added routes here)
app.post('/addSchool', (req, res) => {
  // Your addSchool logic here
});

app.get('/listSchools', (req, res) => {
  // Your listSchools logic here
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
