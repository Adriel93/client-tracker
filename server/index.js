const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'client-tracker.db');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

function createDb() {
  const exists = fs.existsSync(DB_FILE);
  const db = new sqlite3.Database(DB_FILE);

  if (!exists) {
    db.serialize(() => {
      db.run(`CREATE TABLE clients (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT, notes TEXT, createdAt TEXT)`);
      db.run(`CREATE TABLE activities (id TEXT PRIMARY KEY, clientId TEXT, text TEXT, date TEXT, createdAt TEXT)`);
      db.run(`CREATE TABLE pending (id TEXT PRIMARY KEY, clientId TEXT, text TEXT, done INTEGER, createdAt TEXT)`);
      db.run(`CREATE TABLE psa (id TEXT PRIMARY KEY, clientId TEXT, text TEXT, createdAt TEXT)`);
    });
  }

  return db;
}

const db = createDb();

app.get('/api/data', (req, res) => {
  const data = { clients: [], activities: [], pending: [], psa: [] };

  db.serialize(() => {
    db.all('SELECT * FROM clients', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      data.clients = rows;

      db.all('SELECT * FROM activities', [], (err2, rows2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        data.activities = rows2;

        db.all('SELECT * FROM pending', [], (err3, rows3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          data.pending = rows3;

          db.all('SELECT * FROM psa', [], (err4, rows4) => {
            if (err4) return res.status(500).json({ error: err4.message });
            data.psa = rows4;
            res.json(data);
          });
        });
      });
    });
  });
});

app.post('/api/data', (req, res) => {
  const payload = req.body || {};
  const clients = Array.isArray(payload.clients) ? payload.clients : [];
  const activities = Array.isArray(payload.activities) ? payload.activities : [];
  const pending = Array.isArray(payload.pendingItems) ? payload.pendingItems : [];
  const psa = Array.isArray(payload.psaItems) ? payload.psaItems : [];

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run('DELETE FROM clients');
    db.run('DELETE FROM activities');
    db.run('DELETE FROM pending');
    db.run('DELETE FROM psa');

    const insertClient = db.prepare('INSERT INTO clients (id,name,company,notes,createdAt) VALUES (?,?,?,?,?)');
    clients.forEach(c => insertClient.run(c.id, c.name, c.company || '', c.notes || '', c.createdAt || new Date().toISOString()));
    insertClient.finalize();

    const insertActivity = db.prepare('INSERT INTO activities (id,clientId,text,date,createdAt) VALUES (?,?,?,?,?)');
    activities.forEach(a => insertActivity.run(a.id, a.clientId, a.text, a.date, a.createdAt));
    insertActivity.finalize();

    const insertPending = db.prepare('INSERT INTO pending (id,clientId,text,done,createdAt) VALUES (?,?,?,?,?)');
    pending.forEach(p => insertPending.run(p.id, p.clientId, p.text, p.done ? 1 : 0, p.createdAt));
    insertPending.finalize();

    const insertPsa = db.prepare('INSERT INTO psa (id,clientId,text,createdAt) VALUES (?,?,?,?)');
    psa.forEach(p => insertPsa.run(p.id, p.clientId, p.text, p.createdAt));
    insertPsa.finalize();

    db.run('COMMIT', commitErr => {
      if (commitErr) return res.status(500).json({ error: commitErr.message });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);
});

