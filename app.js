const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importar rutas
const login = require('./routes/login');
const credito = require('./routes/credito');
const upload = require('./routes/upload');
const plazo = require('./routes/plazo');
const estadoCuenta = require('./routes/estado-cuenta');
const movimientos = require('./routes/movimientos');
const perfiles = require('./routes/perfiles');
const cobranza = require('./routes/cobranza');
const gastos = require('./routes/gastos');

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());

// Configuración de CORS
const corsOptions = {
  origin: ['https://aalvizo2.github.io', 'http://localhost:3000', 'http://192.168.1.75:3000'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Configuración de rutas estáticas
app.use('/cedula', express.static(path.join(__dirname, 'cedula')));

// Definición de rutas
app.use('/', login);
app.use('/', credito);
app.use('/', upload);
app.use('/', plazo);
app.use('/', estadoCuenta);
app.use('/', movimientos);
app.use('/', perfiles);
app.use('/', cobranza);
app.use('/', gastos);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

// Ruta para evitar que el servidor se duerma en Render
app.get('/keep-alive', (req, res) => {
  res.send('Server is alive');
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Mantener el servidor activo en Render
setInterval(() => {
  fetch(`http://localhost:${PORT}/keep-alive`)
    .then(res => res.text())
    .then(res => console.log(res))
    .catch(err => console.log('Error keeping alive:', err));
}, 5 * 60 * 1000); // Cada 5 minutos
