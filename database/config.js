const mongoose = require('mongoose');
require('dotenv').config();
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
            console.info('Data Base online');

    } catch (error) {
        console.error(error);
        throw new Error('Error a la hora de iniciar la BD');
    }

}


module.exports = {
    dbConnection
}