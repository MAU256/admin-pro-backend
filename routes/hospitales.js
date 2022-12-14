/**
 * Hospitales
 * ruta: /api/hospitales
 */


const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getHospitales);
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es requerido').notEmpty(),
        validarCampos
    ],
    crearHospital);
router.put('/:id',
    [
        validarJWT,
        check('nombre', "El nombre del hospital es obligatorio").notEmpty(),
        validarCampos
    ],
    actualizarHospital);

router.delete('/:id', validarJWT, borrarHospital);


module.exports = router;