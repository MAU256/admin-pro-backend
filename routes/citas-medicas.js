/**
 * Ruta: /api/citas
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const {crearCita, actualizarCita, eliminarCita, getCitaById, getCitas, getCitasPorMedico, getCitasPorPaciente} = require('../controllers/citas-medicas');
const { validarJWT, validarAdminRole, validarRoleOUsuarioPropio } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getCitas);
router.get('/:id', validarJWT, getCitaById);
router.get('/medico/:id', validarJWT, getCitasPorMedico);
router.get('/paciente/:id', validarJWT, getCitasPorPaciente);
router.post('/',
    [
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('fechaEmision', 'La fecha de emision es obligatorio').not().isEmpty(),
        check('fechaCita', 'La fecha de la cita es obligatorio').not().isEmpty(),        
        check('motivo', 'El motivo es obligatorio').not().isEmpty(),
        check('tipoConsulta', 'El tipo de consulta es obligatorio').not().isEmpty(),
        check('estado', 'El estado es obligatorio').not().isEmpty(),
        
        
        validarCampos,
    ],
    crearCita);
router.put('/:id',
    [
        validarJWT,
        validarRoleOUsuarioPropio,
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),        
        check('fechaCita', 'La fecha de la cita es obligatorio').not().isEmpty(),        
        check('motivo', 'El motivo es obligatorio').not().isEmpty(),
        check('tipoConsulta', 'El tipo de consulta es obligatorio').not().isEmpty(),
        check('estado', 'El estado es obligatorio').not().isEmpty(),
        validarCampos,
        
    ],
    actualizarCita);

router.delete('/:id', [validarJWT, validarAdminRole], eliminarCita);


module.exports = router;