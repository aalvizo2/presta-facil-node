const express= require('express')
const Router= express.Router()
const connection= require('./db')

Router.get('/cobranza', (req, res)=>{
    connection.query('SELECT * FROM cobranza', (err, dato)=>{
        if(err) throw err
        res.json({datos: dato})
        connection.query('SELECT * FROM prestamo', (err, data) => {
            if (err) return res.status(500).send('Error al cargar los datos');
        
            const today = moment();
        
            data.forEach(row => {
              const { nombre, monto, fechaPago } = row;
              const fechaPagoMoment = moment(fechaPago, 'DD [de] MMMM [de] YYYY');
        
              if (today.date() > 15 || today.date() > 30) {
                const diasAtraso = today.diff(fechaPagoMoment, 'days');
        
                // Insertar en la tabla cobranza
                const insertCobranzaQuery = 'INSERT INTO cobranza (nombre, monto, dias_atraso, nota, fechaPago) VALUES (?, ?, ?, ?, ?)';
                connection.query(insertCobranzaQuery, [nombre, monto, diasAtraso, `Pago atrasado por ${diasAtraso} días`, today.format('DD [de] MMMM [de] YYYY')], err => {
                  if (err) {
                    console.error('Error al registrar la cobranza:', err);
                    return res.status(500).json({ error: 'Error al registrar la cobranza' });
                  }
                  console.log('Cobranza registrada correctamente');
                });
              }
            });
        
            res.json({ message: 'Pagos actualizados y cobranzas registradas correctamente' });
          });
    })
})

Router.post('/actualizarNota', (req, res)=>{
    console.log('nota del front',req.body)
    const {id, nombre, monto, dias_atraso, nota, fechaPago}= req.body

    connection.query('UPDATE cobranza SET nota=? WHERE id=?', [nota, id], (error)=>{
        if(error) throw err; 
        res.json({message: 'Nota actualizada con exito'})
    })
})


module.exports= Router