
const jwt = require('jsonwebtoken');
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

module.exports = {
    validarJWT
}