const express= require('express')
const Router= express.Router()
const connection= require('../routes/db');
const { emitWarning } = require('process');

Router.get('/check-user/:user', (req, res) => {
    const usuario = req.params.user;
    const query = 'SELECT role FROM admin WHERE usuario = ?';
  
    connection.query(query, [usuario], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener el rol del usuario' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const role = results[0].role;
      res.json({ role });
    });
  });

  Router.post('/create-user', (req, res) => {
    const { usuario, pass, role, permisos } = req.body;
    console.log(req.body);
  
    // Primero verifica si el usuario ya existe
    connection.query('SELECT usuario FROM admin WHERE usuario = ?', [usuario], (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Error en la base de datos' });
        return;
      }
  
      if (results.length > 0) {
        // Si el usuario ya existe
        res.status(409).send({ message: 'El usuario ya existe en la base de datos' });
      } else {
        // Si el usuario no existe, insertarlo
        const permisosJSON = JSON.stringify(permisos);
        connection.query('INSERT INTO admin (usuario, pass, role, permisos) VALUES (?,?,?,?)', [usuario, pass, role, permisosJSON], (err) => {
          if (err) {
            res.status(500).send({ message: 'Error al insertar datos' });
            throw err;
          } else {
            console.log('Datos insertados correctamente');
            res.status(200).send({ message: 'Operación realizada con éxito' });
          }
        });
      }
    });
  });
  
Router.put('/update/:usuario', (req, res)=>{
    const usuario= req.params.usuario
    const{pass}= req.body
    connection.query('UPDATE admin SET pass=? WHERE usuario=?', [pass, usuario], (err) =>{
        if(err) throw err
        console.log('contraseña actualizada correctamente')
    })
})
 
Router.get('/get-roles/:user', (req, res)=>{
    const usuario= req.params.user
    
    connection.query('SELECT role, permisos FROM admin WHERE usuario=?', [usuario], (err, datos)=>{
       if(err) throw err 
       const data= datos[0]
       
       res.json({datos: datos})
    })
})


Router.post('/actualizarPago', (req, res) => {
  const { nombre, monto, fechaInicio, fechaPago, abono, interes, abonoCapital } = req.body;
   console.log('datos recibidos del front', req.body)
  // Consulta para actualizar el pago
  const updateQuery = 'UPDATE usuarios SET monto = ?, fechaInicio = ?, fechaPago = ? WHERE nombre = ?';
  connection.query(updateQuery, [monto, fechaInicio, fechaPago, nombre], (err) => {
    if (err) {
      console.error('Error al actualizar el pago:', err);
      return res.status(500).json({ error: 'Error al actualizar el pago' });
    }

    // Verificar si el pago está atrasado
    const today = moment();
    const fechaPagoMoment = moment(fechaPago, 'DD [de] MMMM [de] YYYY');
    if (today.date() > 15 || today.date() > 30) {
      const diasAtraso = today.diff(fechaPagoMoment, 'days');

      // Insertar en la tabla cobranza
      const insertCobranzaQuery = 'INSERT INTO cobranza (nombre, monto, dias_atraso, nota, fechaPago) VALUES (?, ?, ?, ?, ?)';
      connection.query(insertCobranzaQuery, [nombre, monto, diasAtraso, `Pago atrasado por ${diasAtraso} días`, today.format('DD [de] MMMM [de] YYYY')], (err) => {
        if (err) {
          console.error('Error al registrar la cobranza:', err);
          return res.status(500).json({ error: 'Error al registrar la cobranza' });
        }
        console.log('Cobranza registrada correctamente');
      });
    }

    res.json({ message: 'Pago actualizado y cobranza registrada correctamente' });
  });
});


Router.get('/clienteNombre', (req, res) =>{
  connection.query('SELECT nombre FROM usuarios', (err, Data)=>{
      if(err) throw err 

      res.status(200).json({Data})
      console.log(Data)
  })
})




Router.put('/updateCliente', (req, res) => {
  const datos = req.body;
  
  
  console.log('Datos recibidos para actualizar:', datos);

  const {
    nombre,
    direccion,
    telefono,
    colonia,
    puesto,
    empresa,
    antiguedad,
    sueldo_in,
    sueldo_final,
    redes_sociales,
    id
  } = datos;

  if (!nombre) {
    return res.status(400).send({ message: 'Nombre del cliente es requerido' });
  }

  connection.query(
    `UPDATE usuarios 
     SET direccion=?, telefono=?, colonia=?, puesto=?, empresa=?, antiguedad=?, sueldo_in=?, sueldo_final=?, nombre=?, redes_sociales=? 
     WHERE id=?`,
    [direccion, telefono, colonia, puesto, empresa, antiguedad, sueldo_in, sueldo_final, nombre, redes_sociales, id],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar', err);
        return res.status(500).send({ message: 'Error al actualizar cliente' });
      }

      // Verifica si la fila fue afectada
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }

      res.status(200).send({ message: 'Operación realizada con éxito' });

      const nombreBusqueda = `%${nombre}%`
      connection.query('UPDATE documentos SET nombre=? WHERE nombre LIKE ? ', [nombre, nombreBusqueda], (err)=>{
         if(err) throw err 
         
      })
    }
  );
});

Router.get('/getImages/:clientName', (req, res)=>{
  console.log(req.params)
  const{clientName}= req.params


  connection.query('SELECT * FROM documentos WHERE nombre=?', [clientName], (err, Data)=>{
     if(err) throw err 
     res.status(200).json({Data})
  })
  

})


Router.delete('/eliminarCliente/:nombre', (req, res)=> {
  const {nombre}= req.params
  connection.query('DELETE FROM usuarios WHERE nombre=?', [nombre], (err)=>{
    connection.query('DELETE FROM documentos WHERE nombre=?', [nombre], (err) =>{
      if(err) throw err 
      res.status(200).send('Exito')
    })
  })
})

Router.get('/getRole/:usuario', (req, res) => {
  console.log('usuario enviado', req.params)
  const {usuario} = req.params

  connection.query('SELECT role FROM admin WHERE usuario= ?', [usuario], (err, Data) => {
    if(err) throw err 
    console.log(Data)
    res.json({Data: Data[0]})
  })
})



Router.post('/crearSolicitud', (req, res) => {
  console.log('datos de la solicitud', req.body)
  const {cliente, monto, fechaInicio, frecuenciaPago, plazo, abono, pagoMinimo}= req.body
  
  //Conectamos a la base de datos 
  connection.query('INSERT INTO solicitudes (nombre, monto, frecuenciaPago, plazo, abono, pagoMinimo) VALUES (?,?,?,?,?,?)', 
    [
      cliente,
      monto, 
      
      frecuenciaPago,
      plazo, 
      abono,
      pagoMinimo
    ], (error) => {
       if(error) throw error 
       res.status(200).send({message: 'Operación realizada con éxito'})
    }
  )
})

Router.get('/getSolicitud', (req, res) => {
  connection.query('SELECT * FROM solicitudes', (err, Data) => {
    if(err) throw err 
    res.json({Data: Data})
    console.log(Data)
  })
})


Router.delete('/eliminarSolicitud/:id', (req, res) => {
  const {id} = req.params
  connection.query('DELETE FROM solicitudes WHERE Id=?', [id], (err) => {
    if(err) throw err
    res.status(204).send({message: 'Operación realizada con éxito'})
  })
})


module.exports= Router