const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const login = require('./routes/login')
const credito = require('./routes/credito')
const upload = require('./routes/upload')
const plazo = require('./routes/plazo')
const path = require('path')
const estadoCuenta = require('./routes/estado-cuenta')
const movimientos = require('./routes/movimientos')
const perfiles = require('./routes/perfiles')
const cobranza = require('./routes/cobranza')
const gastos = require('./routes/gastos')

const app = express()

// Configuración de middlewares
app.use(bodyParser.json())
//setting up /cedula folder
app.use('/cedula', express.static(path.join(__dirname, 'cedula')))
// Configuración de CORS
const corsOptions = {
  origin: ['https://aalvizo2.github.io', 'http://localhost:3000', 'http://192.168.1.75:3000'],
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions))

// Configuración de conexión a la base de datos


// Ruta para checar pagos en atraso al cargar la aplicación
/*app.get('/', (req, res) => {
  connection.query('SELECT * FROM prestamo', (err, data) => {
    if (err) return res.status(500).send('Error al cargar los datos')

    const today = moment()

    data.forEach(row => {
      res.send({row})
      const { nombre, monto, fechaPago } = row
      const fechaPagoMoment = moment(fechaPago, 'DD [de] MMMM [de] YYYY')
      
      if (today.date() > 15 || today.date() > 30) {
        const diasAtraso = today.diff(fechaPagoMoment, 'days')

        // Insertar en la tabla cobranza
        const insertCobranzaQuery = 'INSERT INTO cobranza (nombre, monto, dias_atraso, nota, fechaPago) VALUES (?, ?, ?, ?, ?)'
        connection.query(insertCobranzaQuery, [nombre, monto, diasAtraso, `Pago atrasado por ${diasAtraso} días`, today.format('DD [de] MMMM [de] YYYY')], err => {
          if (err) {
            console.error('Error al registrar la cobranza:', err)
            return res.status(500).json({ error: 'Error al registrar la cobranza' })
          }
          console.log('Cobranza registrada correctamente')

        })
      }
    })

    res.json({ message: 'Pagos actualizados y cobranzas registradas correctamente' })
  })
})*/

// Definición de rutas
app.use('/', login)
app.use('/', credito)
app.use('/', upload)
app.use('/', plazo)
app.use('/', estadoCuenta)
app.use('/', movimientos)
app.use('/', perfiles)
app.use('/', cobranza)
app.use('/', gastos)
// Ruta de prueba
/*app.get('/', (req, res) => {
  res.send('Hola Mundo')
})*/

// Ruta para evitar que el servidor se duerma en Render
/*app.get('/keep-alive', (req, res) => {
  res.send('Server is alive')
})*/

// Iniciar el servidor
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`)
})

