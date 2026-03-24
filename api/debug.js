export default function handler(req, res) {
  res.status(200).json({
    DB_HOST: process.env.DB_HOST || 'NOT SET',
    DB_PORT: process.env.DB_PORT || 'NOT SET',
    DB_NAME: process.env.DB_NAME || 'NOT SET',
    DB_USER: process.env.DB_USER || 'NOT SET',
    DB_PASSWORD_SET: !!process.env.DB_PASSWORD,
    DB_PASSWORD_LENGTH: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    connection_string_preview: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD ? '***' : 'NOT_SET'}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
  });
}
