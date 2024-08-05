const mysql = require('mysql');
require('dotenv').config();

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000, // 10 segundos
    acquireTimeout: 10000  // 10 segundos
};

let pool;

function handleDisconnect() {
    pool = mysql.createPool({
        ...db_config,
        connectionLimit: 10, // Número máximo de conexiones en el pool
    });

    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
            }
        }

        if (connection) connection.release();

        return;
    });

    pool.on('connection', (connection) => {
        console.log('New DB connection established');
        connection.on('error', (err) => {
            console.error('DB connection error:', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                handleDisconnect();
            } else {
                throw err;
            }
        });
    });

    pool.on('acquire', (connection) => {
        console.log('Connection %d acquired', connection.threadId);
    });

    pool.on('release', (connection) => {
        console.log('Connection %d released', connection.threadId);
    });
}

handleDisconnect();

module.exports = pool;