const express= require('express')
const Router= express.Router()
const connection= require('./db')



Router.post('/generarGasto', (req, res)=>{
    const {tipoGasto, cantidad, fecha}= req.body

    connection.query('INSERT INTO gastos(nombre, monto, fecha) VALUES(?,?,?)', [tipoGasto, cantidad, fecha], (err)=>{
        if(err){
            res.status(500).send({message: 'Hubo un error al generar la solicitud'})
            throw err
        }else{
            res.status(200).send({message: 'Solicitud realizada con exito'})
        }
    })
})

Router.get('/mostrarGasto', (req, res)=> {
    connection.query('SELECT * FROM gastos', (err, Data)=> {
        if(err) throw err
        res.status(200).json({Data})
        console.log(Data)
    })
})









module.exports= Router