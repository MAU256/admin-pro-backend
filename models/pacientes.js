const { Schema, model } = require('mongoose');

const PacienteSchema = Schema({
    nombre: {
        type: String,
        required: true
    },    
    apellido: {
        type: String,
        required: true
    },    
    fechaNacimiento: {
        type: Date,
        required: true
    },    
    genero: {
        type: String,
        required: true
    },    
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },    
    email: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        required: true
    },    
    // password: {
    //     type: String,
    //     required: true
    // },
    // role: {
    //     type: String,
    //     required: true
    // },
    
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

PacienteSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Paciente', PacienteSchema);