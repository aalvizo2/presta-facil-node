const express = require('express')
const Router = express.Router()
const connection = require('./db')
const { json } = require('body-parser')

Router.use(express.json()) // Middleware para parsear el cuerpo de la solicitud como JSON

Router.post('/enviar', (req, res) => {
  const { datos, datosLaborales, cedula, cartaLaboral, referencias } = req.body;
  console.log('datos enviados del front', req.body);

  try {
    // Parsear los datos JSON
    const datosParsed = JSON.parse(datos);
    const datosLaboralesParsed = JSON.parse(datosLaborales);
    const referenciasData = JSON.parse(referencias).referencias; // Acceder a la propiedad 'referencias'
    const{referenciaFamiliar, referenciaLaboral, formatoReferencias, paga, servicios}= req.body

    // Desestructurar los datos
    const { nombre, direccion, telefono, colonia, cumple, monto, fechaInicio, frecuenciaPago, plazo, estado } = datosParsed;
    const { puesto, empresa, antiguedad, sueldo_in, sueldo_final } = datosLaboralesParsed;

    // Extraer nombres, domicilios y números de teléfono celular de las referencias
    const nombresReferencias = [];
    const domiciliosReferencias = [];
    const celularesReferencias = [];

    // Iterar sobre referenciasData para extraer los datos
    referenciasData.forEach(referencia => {
      nombresReferencias.push(referencia.referencia);
      domiciliosReferencias.push(referencia.referencia_dom);
      celularesReferencias.push(referencia.referencia_cel);
    });

    // Preparar la consulta SQL para insertar los datos en la tabla 'usuarios'
    const sql = `INSERT INTO usuarios (
      nombre, direccion, telefono, colonia, cumple, puesto, empresa, antiguedad, sueldo_in, sueldo_final, cedula, carta_laboral, 
      referencia, referencia_dom, referencia_cel, monto, fechaInicio, frecuenciaPago, plazo, estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Ejecutar la consulta SQL
    connection.query(sql, [
      nombre, direccion, telefono, colonia, cumple, puesto, empresa, antiguedad, sueldo_in, sueldo_final, cedula, cartaLaboral, 
      JSON.stringify(nombresReferencias), JSON.stringify(domiciliosReferencias), JSON.stringify(celularesReferencias), monto, 
      fechaInicio, frecuenciaPago, plazo, estado
    ], (err, result) => {
      if (err) {
        console.error('Error al conectar con la base de datos:', err);
        res.status(500).send({ message: 'Error interno del servidor' });
      } else {
        console.log('Datos insertados correctamente en la base de datos');
        res.status(200).send({ message: 'Éxito al guardar los datos' });

        //second query
        connection.query('INSERT INTO documentos (formato_referencias, pagare, referenciaFamilia, referencia_laboral, servicios,  nombre)VALUES(?,?,?,?,?, ?)', [formatoReferencias, paga, referenciaFamiliar, referenciaLaboral, servicios, nombre], (err)=>{
          if(err) throw err
          console.log('documentos insertados correctamente')
        })
      }
    });
  } catch (error) {
    console.error('Error al parsear los datos JSON:', error);
    res.status(400).send({ message: 'Datos inválidos' });
  }
});



/*Router.get('/datos', (req, res) => {
  connection.query('SELECT nombre FROM usuarios', (err, datos) => {
    if (err) {
      console.error('Error al obtener los datos:', err)
      res.status(500).send('Error interno del servidor')
      return;
    }
    const nombres = datos.map(usuario => usuario.nombre)
    
    res.json({ nombres })
  })
})*/
Router.get('/datos', (req,res)=>{
  connection.query('SELECT * FROM usuarios', (err, datos)=>{
    if(err) throw err 
    res.json({datos: datos})
  })
})
Router.put('/solicitud', (req, res) => {
  const { nombre, monto, frecuenciaPago, fechaInicio, plazo } = req.body
  console.log(req.body)

  // Convertir el timestamp en una fecha
  const timestamp = 625551470362220; // tu timestamp aquí

  // Convertir el timestamp en una fecha
  const fecha = new Date(timestamp);
  
  // Obtener la fecha del año siguiente
  fecha.setFullYear(fecha.getFullYear() + 1);
  
  // Formatear la fecha como una cadena legible
  const fechaLegible = fecha.toLocaleDateString('es-ES', {
    weekday: 'long', // día de la semana como nombre completo
    year: 'numeric', // año como número
    month: 'long', // mes como nombre completo
    day: 'numeric' // día del mes como número
  });
  
  console.log(fechaLegible);
  connection.query(
    'UPDATE usuarios SET monto=?, frecuenciaPago=?, fechaInicio=?, plazo=? WHERE nombre=?',
    [monto, frecuenciaPago, fechaInicio, plazo,  nombre],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar los datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        console.log('Datos actualizados correctamente');
        res.status(200).json({ message: 'Datos actualizados correctamente' })
        
      }
    }
  )

});


Router.get('/cliente/nombre/:nombre', (req, res) => {
  const clientName = req.params.nombre;
  
  
  connection.query('SELECT * FROM usuarios WHERE nombre LIKE?', [clientName], (err, result) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
      res.status(500).send({ message: 'Error interno del servidor' });
    } else if (result.length === 0) {
      res.status(404).send({ message: 'Cliente no encontrado' });
    } else {
      res.status(200).send(result[0]);
    }
  });
});



module.exports = Router



