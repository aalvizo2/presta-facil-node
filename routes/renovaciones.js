const express = require('express')
const Router= express.Router()
const connection= require('./db')
//console.log('hola perros')



Router.get('/renovacionList', (req, res) => {
    connection.query('SELECT * FROM prestamos', (err, Data) => {
        if(err){
            res.status(500).send({message: 'Error al cargar la lista de prestamos'})
        }else{
            res.status(200).send({Data: Data})
        }
    })
})

module.exports= Router