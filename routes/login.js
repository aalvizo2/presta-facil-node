const express= require('express')
const Router = express.Router()
console.log('hola desde login')
const connection= require('./db')
const session= require('express-session')
Router.use(session({
    secret: 'mi_secreto', // Deberías establecer tu propia clave secreta
    resave: false,
    saveUninitialized: true
}));
Router.post('/auth', (req, res) => {
    const { usuario, pass } = req.body;
    connection.query('SELECT * FROM admin WHERE usuario=? AND pass=?', [usuario, pass], (err, results) => {
      if (err) {
        // Manejar error de la consulta
        console.error('Error al consultar la base de datos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (results.length > 0) {
       
        return res.status(200).json({ message: 'Autenticación exitosa' })
      } else {
        // Credenciales inválidas
        return res.status(401).json({ error: 'Credenciales inválidas' })
      }
    })
  })
  

module.exports= session.user
module.exports= Router