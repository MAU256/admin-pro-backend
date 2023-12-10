const { Schema, model } = require('mongoose');

const CitaSchema = Schema({
    titulo: {
        type: String,
        required: true
    },    
    fechaEmision: {
        type: Date,
        required: true
    },    
    fechaCita: {
        type: Date,
        required: true
    },    
    motivo: {
        type: String,
        required: true
    },
    tipoConsulta: {
        type: String,
        required: true
    },    
    estado: {
        type: String,
        required: true
    },
    medico: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Medico'
    },
    paciente: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    }
});

CitaSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Cita', CitaSchema);