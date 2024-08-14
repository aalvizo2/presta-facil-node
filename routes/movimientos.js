const express = require('express');
const moment = require('moment');
const connection = require('./db');  // Asegúrate de que el path sea correcto
const Router = express.Router();

Router.get('/movimientos', (req, res) => {
  const { startDate, endDate } = req.query;
  const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

  const query = `
     SELECT * FROM movimientos
  `;

  connection.query(query, [formattedStartDate, formattedEndDate], (err, resultados) => {
    if (err) {
      console.error('Error al obtener movimientos:', err);
      res.status(500).json({ error: 'Error al obtener movimientos' });
      return;
    }

  
    res.json({ datos: resultados });
  });
});


Router.put('/reducirCaja', async (req, res) => {
  const { monto } = req.body;

  if (!monto || monto <= 0) {
      return res.status(400).json({ error: 'Monto inválido' });
  }

  try {
      // Suponiendo que tienes una tabla o colección para almacenar el total de caja
      const totalCaja = await db.query('SELECT total FROM caja WHERE id = 1');
      if (totalCaja.length === 0) {
          return res.status(404).json({ error: 'Total de caja no encontrado' });
      }

      const nuevoTotal = totalCaja[0].total - monto;

      await db.query('UPDATE caja SET total = ? WHERE id = 1', [nuevoTotal]);

      res.status(200).json({ message: 'Monto de caja reducido exitosamente', total: nuevoTotal });
  } catch (error) {
      console.error('Error al reducir el monto de caja:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});


Router.get('/prestamos', (req, res) => {
    connection.query('SELECT fechaInicio, monto FROM prestamos', (err, Data)=>{
       
       res.json({Data: Data})
    })
})

Router.get('/montoPrestamos', (req, res) => {
  connection.query('SELECT * FROM caja ', (err, Data) => {
     if(err){
         res.status(500).send({message: 'Error al cargar los datos'})
     }else{
         
         
         res.status(200).json({ Data })
     }
  })
})


Router.get('/montoPrestamo/:cliente', (req, res)=> {
   const {cliente}= req.params
   console.log(cliente)

   connection.query('SELECT monto FROM prestamos WHERE nombre=?', [cliente], (err, monto)=>{
     if(err) throw err 
     const Data= monto[0].monto
     res.status(200).json({Data})
   })
})
module.exports = Router;
