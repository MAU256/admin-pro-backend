const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medicos');
const fs = require('fs');
const Paciente = require('../models/pacientes');



const actualizarImagen = async (tipo, id, path, nombreArchivo) => {
    try {
        const mapTipo = {
            'usuarios': await Usuario.findById(id),
            'medicos': await Medico.findById(id),
            'hospitales': await Hospital.findById(id),
            'pacientes': await Paciente.findById(id),
        }
        const resultadoColeccion = mapTipo[tipo];
        if (!resultadoColeccion) {
            console.log("No se pudo guardar la imagen debido a que no encontro un tipo valido.")
            return false;
        }

        const pathViejo = `./uploads/${tipo}/${resultadoColeccion.img}`                
        if (fs.existsSync(pathViejo)) {
            //borrar la imagen si existe
            fs.unlinkSync(pathViejo)
        }
        resultadoColeccion.img = nombreArchivo;        
        await resultadoColeccion.save();
        return true;


    } catch (error) {
        return false;
    }
    
}


module.exports = {
    actualizarImagen
}