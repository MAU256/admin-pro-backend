require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config')
//crear el servidor de express
const app = express();

//Configurar Cors
app.use(cors());

//Carpteta publica
app.use(express.static('public'));


//lectura y parseo del body
app.use(express.json());

dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'))

app.get('*', (req, res) => {
    res.sendFile(path(__dirname, 'public/index.html'));
});




app.listen(process.env.PORT, () => {
    console.log('servidor corriendomen puerto ', process.env.PORT);
})