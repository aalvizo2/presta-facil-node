const express = require('express');
const path = require('path');
const fs = require('fs');
const Router = express.Router();
const fileUpload = require('express-fileupload');
const sharp = require('sharp'); // Importar sharp para la manipulación de imágenes
const connection = require('./db');

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

      return sharp(file.data)
        .resize({ width: 1920 }) // Ajusta el tamaño según sea necesario
        .jpeg({ quality: 80 }) // Ajusta la calidad según sea necesario
        .toBuffer()
        .then((outputBuffer) => {
          // Comprobar si la imagen comprimida es menor de 2MB
          if (outputBuffer.length > 2 * 1024 * 1024) {
            return Promise.reject(new Error('El archivo es demasiado grande incluso después de la compresión'));
          }

          // Guardar la imagen comprimida
          return fs.promises.writeFile(filePath, outputBuffer);
        })
        .catch((err) => {
          return Promise.reject(err);
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
  moveFilesPromises.push(uploadFile(servicios, 'servicios'));

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

  // Procesar y mover el archivo al directorio de subida
  sharp(file.data)
    .resize({ width: 1920 }) // Ajusta el tamaño según sea necesario
    .jpeg({ quality: 80 }) // Ajusta la calidad según sea necesario
    .toBuffer()
    .then((outputBuffer) => {
      // Comprobar si la imagen comprimida es menor de 2MB
      if (outputBuffer.length > 2 * 1024 * 1024) {
        throw new Error('El archivo es demasiado grande incluso después de la compresión');
      }

      // Guardar la imagen comprimida
      return fs.promises.writeFile(path.join(uploadPath, file.name), outputBuffer);
    })
    .then(() => {
      // Ejecutar la consulta a la base de datos después de mover el archivo
      return connection.query('UPDATE documentos SET desembolso = ? WHERE nombre = ?', [file.name, clienteActual]);
    })
    .then(() => {
      res.status(200).send({ message: 'Archivo subido y base de datos actualizada correctamente.' });
    })
    .catch((err) => {
      console.error('Error al procesar el archivo:', err);
      res.status(500).send({ message: 'Error al subir la imagen.' });
    });
});

module.exports = Router;
