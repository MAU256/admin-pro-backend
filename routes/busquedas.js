/**
 * Ruta: /api/todo
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { busqueda, getColeccion } = require('../controllers/busqueda');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get('/:busqueda', validarJWT, busqueda);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getColeccion);

module.exports = router;