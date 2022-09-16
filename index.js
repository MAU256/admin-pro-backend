require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config')
//crear el servidor de express
const app = express();

//Configurar Cors
app.use(cors());

//lectura y parseo del body
app.use(express.json());

dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'))




app.listen(process.env.PORT, () => {
    console.log('servidor corriendomen puerto ', process.env.PORT);
})