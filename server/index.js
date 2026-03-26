const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Debug logging
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 1, // Para serverless
  idleTimeoutMillis: 60000, // Increased to 1 minute
  connectionTimeoutMillis: 20000, // Increased to 20 seconds
  acquireTimeoutMillis: 20000, // Increased to 20 seconds
});

async function createTables() {
  try {
    console.log('Creating clients table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT,
        notes TEXT,
        "createdAt" TEXT
      )
    `);
    console.log('Clients table created or already exists');

    console.log('Creating activities table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        "clientId" TEXT,
        text TEXT,
        date TEXT,
        "createdAt" TEXT
      )
    `);
    console.log('Activities table created or already exists');

    console.log('Creating pending table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pending (
        id TEXT PRIMARY KEY,
        "clientId" TEXT,
        text TEXT,
        done BOOLEAN,
        "createdAt" TEXT
      )
    `);
    console.log('Pending table created or already exists');

    console.log('Creating psa table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS psa (
        id TEXT PRIMARY KEY,
        "clientId" TEXT,
        text TEXT,
        "createdAt" TEXT
      )
    `);
    console.log('PSA table created or already exists');

    console.log('All tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    // Don't throw the error, just log it
    // throw err;
  }
}

async function startServer() {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`🚀 API server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.get('/api/data', async (req, res) => {
  console.log('GET /api/data called');
  try {
    console.log('Attempting to query clients table...');
    const clients = await pool.query('SELECT * FROM clients');
    console.log('Clients query successful, rows:', clients.rows.length);
    
    console.log('Attempting to query activities table...');
    const activities = await pool.query('SELECT * FROM activities');
    console.log('Activities query successful, rows:', activities.rows.length);
    
    console.log('Attempting to query pending table...');
    const pending = await pool.query('SELECT * FROM pending');
    console.log('Pending query successful, rows:', pending.rows.length);
    
    console.log('Attempting to query psa table...');
    const psa = await pool.query('SELECT * FROM psa');
    console.log('PSA query successful, rows:', psa.rows.length);

    const data = {
      clients: clients.rows,
      activities: activities.rows,
      pending: pending.rows,
      psa: psa.rows
    };

    console.log('Data retrieved:', {
      clients: data.clients.length,
      activities: data.activities.length,
      pending: data.pending.length,
      psa: data.psa.length
    });

    res.json(data);
  } catch (err) {
    console.error('Error in GET /api/data:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Global error handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

// Keep the event loop alive
setInterval(() => {
  // Do nothing, just keep the process alive
}, 1000);

