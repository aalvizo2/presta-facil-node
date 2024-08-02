const express = require('express');
const moment = require('moment');
const connection = require('./db');
const Router = express.Router();

Router.get('/lista-clientes', (req, res) => {
    connection.query('SELECT nombre, MAX(fecha_pago) AS ultima_fecha_pago FROM movimientos GROUP BY nombre', (err, resultados) => {
        if (err) {
            console.error('Error al obtener la lista de clientes:', err);
            res.status(500).json({ error: 'Error al obtener la lista de clientes' });
            return;
        }
        res.json({ datos: resultados });
    });
});

Router.get('/estado-cuenta/:cliente', (req, res) => {
    const cliente = req.params.cliente;
    connection.query('SELECT * FROM movimientos WHERE nombre = ? ORDER BY fecha_pago DESC', [cliente], (err, resultados) => {
        if (err) {
            console.error('Error al obtener el estado de cuenta del cliente:', err);
            res.status(500).json({ error: 'Error al obtener el estado de cuenta del cliente' });
            return;
        }
        if (resultados.length === 0) {
            res.status(404).json({ error: 'No se encontró el estado de cuenta del cliente' });
            return;
        }
        res.json({ estadoCuenta: resultados });
    });
});

module.exports = Router;
