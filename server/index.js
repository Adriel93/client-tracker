const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db.gwxaugdghuybobojrwxo.supabase.co',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT,
        notes TEXT,
        "createdAt" TEXT
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        "clientId" TEXT,
        text TEXT,
        date TEXT,
        "createdAt" TEXT
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pending (
        id TEXT PRIMARY KEY,
        "clientId" TEXT,
        text TEXT,
        done BOOLEAN,
        "createdAt" TEXT
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS psa (
        id TEXT PRIMARY KEY,
        "clientId" TEXT,
        text TEXT,
        "createdAt" TEXT
      )
    `);
    console.log('Tables created or already exist');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

createTables();

app.get('/api/data', async (req, res) => {
  try {
    const clients = await pool.query('SELECT * FROM clients');
    const activities = await pool.query('SELECT * FROM activities');
    const pending = await pool.query('SELECT * FROM pending');
    const psa = await pool.query('SELECT * FROM psa');

    res.json({
      clients: clients.rows,
      activities: activities.rows,
      pending: pending.rows,
      psa: psa.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/data', async (req, res) => {
  const payload = req.body || {};
  const clients = Array.isArray(payload.clients) ? payload.clients : [];
  const activities = Array.isArray(payload.activities) ? payload.activities : [];
  const pending = Array.isArray(payload.pendingItems) ? payload.pendingItems : [];
  const psa = Array.isArray(payload.psaItems) ? payload.psaItems : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM clients');
    await client.query('DELETE FROM activities');
    await client.query('DELETE FROM pending');
    await client.query('DELETE FROM psa');

    for (const c of clients) {
      await client.query('INSERT INTO clients (id, name, company, notes, "createdAt") VALUES ($1, $2, $3, $4, $5)', [c.id, c.name, c.company || '', c.notes || '', c.createdAt || new Date().toISOString()]);
    }

    for (const a of activities) {
      await client.query('INSERT INTO activities (id, "clientId", text, date, "createdAt") VALUES ($1, $2, $3, $4, $5)', [a.id, a.clientId, a.text, a.date, a.createdAt]);
    }

    for (const p of pending) {
      await client.query('INSERT INTO pending (id, "clientId", text, done, "createdAt") VALUES ($1, $2, $3, $4, $5)', [p.id, p.clientId, p.text, p.done, p.createdAt]);
    }

    for (const p of psa) {
      await client.query('INSERT INTO psa (id, "clientId", text, "createdAt") VALUES ($1, $2, $3, $4)', [p.id, p.clientId, p.text, p.createdAt]);
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);
});

