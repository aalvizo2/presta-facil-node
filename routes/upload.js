const express = require('express');
const path = require('path');
const fs = require('fs'); // Importar el módulo fs
const Router = express.Router();
const fileUpload = require('express-fileupload');
const connection= require('./db')

Router.use(fileUpload());

// Configurar para servir archivos estáticos
Router.use('/cedula', express.static(path.join(__dirname, 'cedula')));
Router.use('/carta-laboral', express.static(path.join(__dirname, 'carta-laboral')));
Router.use('/formato-referencias', express.static(path.join(__dirname, 'formato-referencias')));
Router.use('/pagare', express.static(path.join(__dirname, 'pagare')));
Router.use('/referencia-familiar', express.static(path.join(__dirname, 'referencia-familiar')));
Router.use('/referencia-laboral', express.static(path.join(__dirname, 'referencia-laboral')));
Router.use('/desembolso', express.static(path.join(__dirname, 'desembolso')));



Router.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: 'Favor de subir un archivo' });
  }

  const {
    cedula,
    cartaLaboral,
    formatoReferencias,
    pagare,
    referenciaFamiliar,
    referenciaLaboral,
    servicios
  } = req.files;

  const moveFilesPromises = [];

  const uploadFile = (file, directory) => {
    if (file) {
      const filePath = path.join(__dirname, directory, file.name);
      return new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    return Promise.resolve();
  };

  moveFilesPromises.push(uploadFile(cedula, 'cedula'));
  moveFilesPromises.push(uploadFile(cartaLaboral, 'carta-laboral'));
  moveFilesPromises.push(uploadFile(formatoReferencias, 'formato-referencias'));
  moveFilesPromises.push(uploadFile(pagare, 'pagare'));
  moveFilesPromises.push(uploadFile(referenciaFamiliar, 'referencia-familiar'));
  moveFilesPromises.push(uploadFile(referenciaLaboral, 'referencia-laboral'));
  moveFilesPromises.push(uploadFile(servicios, 'servicios'))

  Promise.all(moveFilesPromises)
    .then(() => {
      res.send('Files uploaded!');
    })
    .catch((err) => {
      console.error('Error al mover archivos:', err);
      res.status(500).send('Error al mover archivos.');
    });
});

Router.post('/subirDesembolso/:clienteActual', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: 'No se ha subido ningún archivo.' });
  }

  const { clienteActual } = req.params;
  const file = req.files.file;

  if (!file) {
    return res.status(400).send({ message: 'No se ha subido ningún archivo.' });
  }

  // Definir el path de subida
  const uploadPath = path.join(__dirname, 'desembolso');

  // Crear directorio si no existe
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Mover el archivo al directorio de subida
  file.mv(path.join(uploadPath, file.name), (err) => {
    if (err) {
      console.error('Error al mover el archivo: ', err);
      return res.status(500).send({ message: 'Error al subir la imagen.' });
    }

    // Ejecutar la consulta a la base de datos después de mover el archivo
    connection.query('UPDATE documentos SET desembolso = ? WHERE nombre = ?', [file.name, clienteActual], (err) => {
      if (err) {
        console.error('Error al actualizar la base de datos: ', err);
        return res.status(500).send({ message: 'Error al actualizar la base de datos.' });
      }

      res.status(200).send({ message: 'Archivo subido y base de datos actualizada correctamente.' });
    });
  });
});

module.exports = Router;
