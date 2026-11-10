const sql = require('mssql');

// Configuración de la conexión a SQL Server (valores tomados de .env)
const sqlConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'TuPassword123!',
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'miapp_sql',
  options: {
    encrypt: false,              // true si usas Azure SQL
    trustServerCertificate: true // necesario en instalaciones locales
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

// Un único pool de conexiones compartido por toda la app
const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Error de conexión con SQL Server:', err.message);
    throw err;
  });

module.exports = { sql, poolPromise };
