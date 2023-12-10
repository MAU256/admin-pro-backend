/**
 * Ruta: /api/pacientes
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { getPacientes, crearPaciente, actualizarPaciente, getPacienteById, eliminarPaciente } = require('../controllers/pacientes');
const { validarJWT, validarAdminRole, validarRoleOUsuarioPropio } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getPacientes);
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // check('password', 'El password es obligatorio').not().isEmpty(),
        check('status', 'El status es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    crearPaciente);
router.put('/:id',
    [
        validarJWT,
        // validarRoleOUsuarioPropio,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El nombre es obligatorio').not().isEmpty(),
        check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
        check('genero', 'El genero es obligatorio').not().isEmpty(),
        check('direccion', 'La direccion es obligatoria').not().isEmpty(),
        check('telefono', 'El telefono es obligatorio').not().isEmpty(),
        validarCampos,
        
    ],
    actualizarPaciente);
router.get('/:id', validarJWT, getPacienteById);

router.delete('/:id', [validarJWT, validarAdminRole], eliminarPaciente);


module.exports = router;