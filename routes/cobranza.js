const express= require('express')
const Router= express.Router()
const connection= require('./db')

Router.get('/cobranza', (req, res)=>{
    connection.query('SELECT * FROM cobranza', (err, dato)=>{
        if(err) throw err
        
        res.json({datos: dato})
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