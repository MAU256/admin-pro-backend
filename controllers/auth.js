const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) =>{
    try {
        const {email, password} = req.body;

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
           return res.status(404).json({
                ok: false, 
                msg: 'Email no valido'
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'password no valido'
            });

        }

        //Generar el token -JWT
        const token = await generarJWT(usuarioDB.id);



        res.json({
            ok: true,
            token

        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            error    
        });
        
    }

}


module.exports = {
    login
}