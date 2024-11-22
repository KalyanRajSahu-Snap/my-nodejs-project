const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Letsdowork-1234',
    database: 'school_management',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database!');
        // Test a query
        db.query('SELECT * FROM schools', (err, results) => {
            if (err) {
                console.error('Query failed:', err);
            } else {
                console.log('Results:', results);
            }
            db.end(); // Close the connection
        });
    }
});
