const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');


const login = async (req, res = response) => {
    try {
        const { email, password } = req.body;

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password no valido'
            });

        }
        //Generar el token -JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend(usuarioDB.role)

        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });

    }

}


const googleSignIn = async (req, res = response) => {


    try {
        const { email, name, picture } = await googleVerify(req.body.token);
        const usuarioDB = await Usuario.findOne({ email });
        // console.log(req.body.token)
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });

        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }
        //guardar usuario google
        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            email, name, picture,
            token,
            menu: getMenuFrontend(usuarioDB.role)

        });


    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });

    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //Generar el token -JWT
    const token = await generarJWT(uid);

    //obtener el usuario por UID    
    const usuario = await Usuario.findById(uid);

    // console.log(token.)


    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontend(usuario.role)

    });
}


module.exports = {
    login,
    googleSignIn,
    renewToken
}