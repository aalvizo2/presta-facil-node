const express = require('express');
const Router = express.Router();
const moment = require('moment');
const connection = require('./db');
require('moment/locale/es');

Router.get('/datos_prestamo', (req, res) => {
    const nombre = req.query.nombre;
    if (!nombre) {
        return res.status(400).json({ error: "El nombre es requerido" });
    }

    connection.query('SELECT * FROM usuarios WHERE nombre=?', [nombre], (err, datos) => {
        if (err) {
            console.error("Error al ejecutar la consulta SQL:", err);
            return res.status(500).json({ error: "Error al ejecutar la consulta SQL" });
        }

        if (datos.length > 0) {
            const interes = 0.1;
            const prestamo = datos[0];
            const montoOriginal = prestamo.monto;
            const monto = montoOriginal;
            console.log(monto);
            const plazo = prestamo.plazo;
            const fechaInicio = prestamo.fechaInicio;
            const fechaInicial = moment(fechaInicio, 'YYYY-MM-DD');
            const frecuenciaPago = prestamo.frecuenciaPago;

            // Calcula la fecha del próximo pago
            const hoy = moment();
            let proximoPago;

            if (hoy.date() <= 15) {
                proximoPago = moment().date(15);
            } else {
                proximoPago = moment().add(1, 'months').date(15);
            }

            if (hoy.date() > 15 && hoy.date() <= 30) {
                proximoPago = moment().date(30);
            } else if (hoy.date() > 30) {
                proximoPago = moment().add(1, 'months').date(15);
            }

            // Calcula los días restantes hasta el próximo pago
            const diasRestantes = proximoPago.diff(hoy, 'days');
            const interesDiario = (montoOriginal * interes) / 15; // Interés diario para la quincena
            const interesProporcional = interesDiario * diasRestantes; // Interés acumulado proporcional

            // Ajusta el monto total y el pago mínimo en base al interés acumulado
            const montoRebajado = monto - interesProporcional;
            const pagoMinimoRebajado = interesProporcional;
            console.log(montoRebajado);

            return res.json({ 
                datos: datos, 
                montoTotal: montoRebajado, 
                pagoMinimo: pagoMinimoRebajado 
            });
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

/**
 * Endpoint to fetch client data.
 */
Router.get('/datosCliente/:cliente', (req, res) => {
    const nombre = req.params.cliente;
    connection.query('SELECT * FROM usuarios WHERE nombre=?', [nombre], (error, results) => {
        if (error) {
            console.error("Error al ejecutar la consulta SQL:", error);
            return res.status(500).json({ error: "Error al ejecutar la consulta SQL" });
        }
        return res.json(results);
    });
});

/**
 * Endpoint to update the status of a client.
 */
Router.put('/actualizarEstatus/:cliente', (req, res) => {
    const cliente = req.params.cliente;
    const { estatus, monto, fechaInicio, frecuenciaPago } = req.body;
    console.log(fechaInicio);

    if (estatus === 'Aprobado') {
        connection.query('UPDATE usuarios SET estado = ? WHERE nombre = ?', [estatus, cliente], (err) => {
            if (err) {
                console.error('Error actualizando estado en usuarios:', err);
                return res.status(500).send('Error actualizando estado');
            }

            console.log('Estado actualizado correctamente en usuarios');

            // Calcular el monto actualizado
            const interes = 0.1;
            const montoActualizado = monto;
            const fechaInicial = moment(fechaInicio, 'YYYY-MM-DD');
            const hoy = moment();
            let proximoPago;

            if (hoy.date() <= 15) {
                proximoPago = moment().date(15);
            } else {
                proximoPago = moment().add(1, 'months').date(15);
            }

            if (hoy.date() > 15 && hoy.date() <= 30) {
                proximoPago = moment().date(30);
            } else if (hoy.date() > 30) {
                proximoPago = moment().add(1, 'months').date(15);
            }

            const diasRestantes = proximoPago.diff(hoy, 'days');
            const interesDiario = (monto * interes) / 15;
            const interesProporcional = interesDiario * diasRestantes;
            const montoRebajado = montoActualizado - interesProporcional;
            const montoRedondeado= Math.round(montoRebajado)
            const pagoMinimoRebajado = interesProporcional;

            connection.query('INSERT INTO prestamos (nombre, monto, fechaInicio, frecuenciaPago) VALUES (?,?,?,?)', [cliente, montoRebajado, fechaInicio, frecuenciaPago], (err) => {
                if (err) {
                    console.error('Error insertando datos en prestamos:', err);
                    return res.status(500).send('Error insertando datos en prestamos');
                }

                console.log('Datos insertados correctamente en prestamos');
                connection.query('INSERT INTO caja (total, fecha, nombre, monto) VALUES(?,?,?,?)', [montoRedondeado, fechaInicio, cliente, monto], (error) => {
                    if(err) throw err
                    console.log('monto actualizado', montoRebajado)
                })
                return res.json({
                    mensaje: 'Datos actualizados correctamente',
                    montoActualizado: montoRebajado,
                    pagoMinimo: pagoMinimoRebajado
                });
            });
        });
    } else if (estatus === 'Rechazado') {
        connection.query('UPDATE usuarios SET estado=? WHERE nombre=?', [estatus, cliente], (err) => {
            if (err) {
                console.error('Error actualizando estado en usuarios:', err);
                return res.status(500).send('Error actualizando estado');
            }
            console.log('Prestamo Rechazado');
            return res.send('Prestamo Rechazado');
        });
    } else {
        return res.status(400).send('Estatus inválido');
    }
});

/**
 * Endpoint to get the list of clients.
 */
Router.get('/listaClientes', (req, res) => {
    connection.query('SELECT nombre, estado, fechaInicio FROM usuarios', (err, datos) => {
        if (err) {
            console.error('Error al buscar clientes:', err);
            return res.status(500).json({ error: 'Error al buscar clientes' });
        }
        return res.json({ datos: datos });
    });
});

/**
 * Endpoint to filter clients based on search criteria.
 */
Router.post('/filtrarCliente', (req, res) => {
    const { buscar } = req.body;
    connection.query('SELECT * FROM prestamos', (err, results) => {
        if (err) {
            console.error('Error al buscar usuarios:', err);
            return res.status(500).json({ error: 'Error al buscar usuarios' });
        }

        if (results.length > 0) {
            const datosFormateados = results.map(cliente => ({
                ...cliente,
                fechaInicio: moment(cliente.fechaInicio).format('YYYY-MM-DD'),
                fechaPago: moment(cliente.fechaPago).format('YYYY-MM-DD')
            }));
            return res.json({ resultados: datosFormateados });
        } else {
            return res.json({ resultados: [] });
        }
    });
});

/**
 * Endpoint to update the payment information of a client.
 */
Router.post('/actualizarPago', (req, res) => {
    const { nombre, monto, fechaInicio, fechaPago, abono, interes, abonoCapital } = req.body;
    if (!nombre || !monto || !fechaInicio || !fechaPago || !abono || !interes || !abonoCapital) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
  
    connection.query(
      'UPDATE prestamos SET monto = ?, fechaInicio = ?, fechaPago = ? WHERE nombre = ?', 
      [monto, moment(fechaInicio, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD'), moment(fechaPago, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD'), nombre], 
      (err, resultados) => {
        if (err) {
          console.error('Error al actualizar el pago:', err);
          return res.status(500).json({ error: 'Error al actualizar el pago' });
        }
  
        // Insert movement into the movimientos table
        connection.query(
          'INSERT INTO movimientos (nombre, fecha_pago, abono, interes, abonoCapital, saldo) VALUES (?, ?, ?, ?, ?, ?)',
          [nombre, moment().format('YYYY-MM-DD'), abono, interes, abonoCapital, monto],
          (err, resultados) => {
            if (err) {
              console.error('Error al insertar el movimiento:', err);
              return res.status(500).json({ error: 'Error al insertar el movimiento' });
            }
  
            // Select and return the updated record
            connection.query('SELECT * FROM prestamos WHERE nombre = ?', [nombre], (err, resultados) => {
              if (err) {
                console.error('Error al seleccionar el registro actualizado:', err);
                return res.status(500).json({ error: 'Error al seleccionar el registro actualizado' });
              }
  
              return res.json({ datos: resultados });
            });
          }
        );
      }
    );
});




module.exports = Router;
