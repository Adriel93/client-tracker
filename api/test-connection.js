const { Pool } = require('pg');

export default async function handler(req, res) {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    console.log('[TEST] Attempting connection...');
    const client = await pool.connect();
    console.log('[TEST] Connected successfully');

    const result = await client.query('SELECT NOW()');
    console.log('[TEST] Query result:', result.rows[0]);

    client.release();
    pool.end();

    res.status(200).json({
      status: 'success',
      timestamp: result.rows[0].now,
      message: 'Database connection successful'
    });
  } catch (err) {
    console.error('[TEST] Connection failed:', err.message, err.code, err.syscall, err.hostname);
    pool.end();
    res.status(500).json({
      status: 'error',
      error: err.message,
      code: err.code,
      syscall: err.syscall,
      hostname: err.hostname
    });
  }
}
