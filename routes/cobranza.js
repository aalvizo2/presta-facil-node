const express = require('express')
const Router = express.Router();
const connection = require('./db')
const moment = require('moment')

Router.get('/cobranza', (req, res) => {
    connection.query('SELECT * FROM prestamos', (err, data) => {
        if (err) {
            console.error('Error al obtener datos de prestamo:', err)
            return res.status(500).send('Error al obtener datos de prestamo')
        }

        const today = moment()

        // Procesamos los datos y actualizamos la tabla cobranza
        const updatePromises = data.map(row => {
            const { nombre, monto, fechaPago } = row;
            const fechaPagoMoment = moment(fechaPago, 'YYYY-MM-DD');

            if (today.date() > 15) {
                const diasAtraso = today.diff(fechaPagoMoment, 'days')
                // Verificar si el registro ya existe
                const checkQuery = 'SELECT COUNT(*) AS count FROM cobranza WHERE nombre = ? AND fechaPago = ?'
                return new Promise((resolve, reject) => {
                    connection.query(checkQuery, [nombre, today.format('YYYY-MM-DD')], (err, results) => {
                        if (err) {
                            console.error('Error al verificar existencia de la cobranza:', err)
                            return reject(err)
                        }

                        if (results[0].count === 0) {
                            // Insertar en la tabla cobranza si no existe
                            const insertCobranzaQuery = 'INSERT INTO cobranza (nombre, monto, dias_atraso, nota, fechaPago) VALUES (?, ?, ?, ?, ?)';
                            connection.query(insertCobranzaQuery, [nombre, monto, diasAtraso, `Pago atrasado por ${diasAtraso} días`, today.format('YYYY-MM-DD')], err => {
                                if (err) {
                                    console.error('Error al registrar la cobranza:', err)
                                    return reject(err)
                                }
                                console.log('Cobranza registrada correctamente')
                                resolve()
                            });
                        } else {
                            resolve() // El registro ya existe, no es necesario hacer nada
                        }
                    });
                });
            }
            return Promise.resolve();// Si no hay atraso, no se hace nada
        });

        Promise.all(updatePromises)
            .then(() => {
                connection.query('SELECT * FROM cobranza', (err, datos) => {
                    if (err) {
                        console.error('Error al obtener datos de cobranza:', err)
                        return res.status(500).send('Error al obtener datos de cobranza')
                    }
                    res.json({ datos })
                })
            })
            .catch(err => {
                console.error('Error al registrar cobranzas:', err)
                res.status(500).json({ error: 'Error al registrar cobranzas' })
            })
    })
})

Router.post('/actualizarNota', (req, res) => {
    const { id, nota } = req.body

    connection.query('UPDATE cobranza SET nota=? WHERE id=?', [nota, id], (error) => {
        if (error) {
            console.error('Error al actualizar la nota:', error)
            return res.status(500).json({ error: 'Error al actualizar la nota' })
        }
        res.json({ message: 'Nota actualizada con éxito' })
    })
})

module.exports = Router
