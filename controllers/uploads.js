const { response } = require("express");
const { v4: uuidv4 } = require('uuid')
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const path = require('path');
const fs = require('fs')

const fileUpload = (req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    const tiposValidos = ['hospitales', 'medicos', 'usuarios', 'pacientes'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(404).json({
            ok: false,
            msg: "El tipo es incorrecto, solo se permiten pacientes, hospitales, medicos o usuarios"
        });
    }


    //Se valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay archivos cargados"
        })
    }
    //Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); // separar la extencion
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: true,
            msg: 'Extension de la imagen no valida'
        });
    }

    //generar nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //Crear el path para guardar la imagen

    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la imagen

    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Actualizar base de datos
        actualizarImagen(tipo, id, path, nombreArchivo);


        res.json({
            ok: true,
            msg: 'archivo subido',
            nombreArchivo
        });

    });
};

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    
    if (fs.existsSync(pathImg)) {
        //mostrar imagen
        res.sendFile(pathImg);
    }else{
        //imagen por defecto
        const pathImg = path.join(__dirname, '../uploads/no-image.jpg');
        res.sendFile(pathImg);
    }






}



module.exports = {
    fileUpload,
    retornaImagen
}