const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
// Permite peticiones desde los frontends en localhost, en cualquier puerto
// (React usa 5173 y Angular 4200, pero cambian si el puerto está ocupado)
app.use(cors({ origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ }));

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', api: '/api/users' }));

// Conectar con SQL Server y luego iniciar el servidor
poolPromise
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor backend corriendo en http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.error('Revisa que SQL Server esté encendido y los datos de .env');
    process.exit(1);
  });
