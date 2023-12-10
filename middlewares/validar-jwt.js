const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const validarJWT = (req, res, next) => {
    //leer el token
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No existe un token en la peticion"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no valido"
        });

    }

    next();
}

const validarAdminRole = async(req, res, next) => {
    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            });
        }
        next();
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'hubo un error inesperado'
        });
        
    }    
}

const validarRoleOUsuarioPropio = async(req, res, next) => {
    const uid = req.uid;
    const id = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if(usuarioDB.role !== 'ADMIN_ROLE' && uid !== id){
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            });
        }
        next();
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'hubo un error inesperado'
        });
        
    }
    
}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarRoleOUsuarioPropio
}