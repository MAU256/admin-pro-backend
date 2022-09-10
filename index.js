require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config')
//crear el servidor de express
const app = express();

//Configurar Cors
app.use(cors());

dbConnection();

//rutas 
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'Hola mundo'
    });
});

app.listen(process.env.PORT, () => {
    console.log('servidor corriendomen puerto ', process.env.PORT);
})