const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medicos');
const fs = require('fs');



const actualizarImagen = async (tipo, id, path, nombreArchivo) => {
    try {
        const mapTipo = {
            'usuarios': await Usuario.findById(id),
            'medicos': await Medico.findById(id),
            'hospitales': await Hospital.findById(id),
        }
        const resultadoColeccion = mapTipo[tipo];

        if (resultadoColeccion.length == 0) {
            return false;
        }

        const pathViejo = `./uploads/${tipo}/${resultadoColeccion.img}`        
        console.log('path viejo', pathViejo)
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