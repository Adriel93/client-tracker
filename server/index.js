const express = require('express');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Connect to database
db.connect().catch(err => {
  console.error('DB connection error:', err);
  process.exit(1);
});

// Initialize tables on startup
async function initDb() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      notes TEXT,
      created_at TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      text TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS pending (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      text TEXT NOT NULL,
      done BOOLEAN DEFAULT false,
      created_at TEXT,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS psa (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`);

    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('Error initializing tables:', err);
  }
}

app.use(express.json());

// Get all data
app.get('/api/data', async (req, res) => {
  try {
    const clientsRes = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    const activitiesRes = await db.query('SELECT * FROM activities ORDER BY date ASC');
    const pendingRes = await db.query('SELECT * FROM pending ORDER BY created_at DESC');
    const psaRes = await db.query('SELECT * FROM psa ORDER BY created_at DESC');

    const mapResults = (rows) => rows.map(r => ({
      id: r.id,
      clientId: r.client_id || r.clientId,
      text: r.text,
      date: r.date,
      name: r.name,
      company: r.company,
      notes: r.notes,
      done: r.done,
      createdAt: r.created_at || r.createdAt
    }));

    res.json({
      clients: mapResults(clientsRes.rows),
      activities: mapResults(activitiesRes.rows),
      pending: mapResults(pendingRes.rows),
      psa: mapResults(psaRes.rows)
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Save all data (sync)
app.post('/api/data', async (req, res) => {
  const client = await db.connect().catch(() => db);
  try {
    await db.query('BEGIN');

    const { clients = [], activities = [], pendingItems = [], psaItems = [] } = req.body;

    // Clear existing data
    await db.query('DELETE FROM psa');
    await db.query('DELETE FROM pending');
    await db.query('DELETE FROM activities');
    await db.query('DELETE FROM clients');

    // Insert clients
    for (const c of clients) {
      await db.query(
        'INSERT INTO clients (id, name, company, notes, created_at) VALUES ($1, $2, $3, $4, $5)',
        [c.id, c.name, c.company || '', c.notes || '', c.createdAt || new Date().toISOString()]
      );
    }

    // Insert activities
    for (const a of activities) {
      await db.query(
        'INSERT INTO activities (id, client_id, text, date, created_at) VALUES ($1, $2, $3, $4, $5)',
        [a.id, a.clientId, a.text, a.date, a.createdAt]
      );
    }

    // Insert pending
    for (const p of pendingItems) {
      await db.query(
        'INSERT INTO pending (id, client_id, text, done, created_at) VALUES ($1, $2, $3, $4, $5)',
        [p.id, p.clientId, p.text, p.done || false, p.createdAt]
      );
    }

    // Insert PSA
    for (const p of psaItems) {
      await db.query(
        'INSERT INTO psa (id, client_id, text, created_at) VALUES ($1, $2, $3, $4)',
        [p.id, p.clientId, p.text, p.createdAt]
      );
    }

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    console.error('Error saving data:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  initDb().then(() => {
    console.log(`🚀 API server listening on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.end();
  process.exit(0);
});

