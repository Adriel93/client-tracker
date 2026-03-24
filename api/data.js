const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function createTables() {
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
}

async function handler(req, res) {
  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    console.error('Missing DB env vars', {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT,
      DB_PASSWORD_SET: !!process.env.DB_PASSWORD,
    });
    return res.status(500).json({ error: 'Missing DB configuration' });
  }

  try {
    await createTables();

    if (req.method === 'GET') {
      const clients = await pool.query('SELECT * FROM clients');
      const activities = await pool.query('SELECT * FROM activities');
      const pending = await pool.query('SELECT * FROM pending');
      const psa = await pool.query('SELECT * FROM psa');

      return res.status(200).json({
        clients: clients.rows,
        activities: activities.rows,
        pending: pending.rows,
        psa: psa.rows,
      });
    }

    if (req.method === 'POST') {
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
          await client.query('INSERT INTO clients (id, name, company, notes, "createdAt") VALUES ($1, $2, $3, $4, $5)', [
            c.id,
            c.name,
            c.company || '',
            c.notes || '',
            c.createdAt || new Date().toISOString(),
          ]);
        }

        for (const a of activities) {
          await client.query('INSERT INTO activities (id, "clientId", text, date, "createdAt") VALUES ($1, $2, $3, $4, $5)', [
            a.id,
            a.clientId,
            a.text,
            a.date,
            a.createdAt,
          ]);
        }

        for (const p of pending) {
          await client.query('INSERT INTO pending (id, "clientId", text, done, "createdAt") VALUES ($1, $2, $3, $4, $5)', [
            p.id,
            p.clientId,
            p.text,
            p.done,
            p.createdAt,
          ]);
        }

        for (const p of psa) {
          await client.query('INSERT INTO psa (id, "clientId", text, "createdAt") VALUES ($1, $2, $3, $4)', [
            p.id,
            p.clientId,
            p.text,
            p.createdAt,
          ]);
        }

        await client.query('COMMIT');
        return res.status(200).json({ success: true });
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('POST /api/data rollback error', err);
        return res.status(500).json({ error: err.message });
      } finally {
        client.release();
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('API /api/data error', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
