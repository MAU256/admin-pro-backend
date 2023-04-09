
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        Usuario.count()

    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;
    console.log(req.body)

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        const usuario = new Usuario(req.body);

        //Encriptar Contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Generar token - JWT
        const token = await generarJWT(usuario.id);

        console.log(generarJWT)
        //Guardar usuario
        await usuario.save();
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id;    
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        const { password, google, email, ...campos } = req.body;
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        if(!usuarioDB.google){
            campos.email = email;
        }else if(usuarioDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no puede actualizar el email'
            });

        }
        

        //Actualizar datos
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {

        console.info('--------------', error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
}

const eliminarUsuario = async (req, res = response) => {

    try {
        const uid = req.params.id;
        const usuarioDB = await Usuario.findById(uid);


        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Error, usuario no encontrado"
            })
        }
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: "Usuario eliminado"
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })

    }



}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}