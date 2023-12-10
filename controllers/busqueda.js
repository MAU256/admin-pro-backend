const { response } = require('express')
// const { bcrypt } = require('bcryptjs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const Paciente = require('../models/pacientes');
// const { generarJWT } = require('../helpers/jwt');

const busqueda = async (req, res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [listaUsuarios, listaMedicos, listaHospitales, listaPacientes] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
        Paciente.find({ nombre: regex })

    ]);
    const usuarios = listaUsuarios.length > 0 ? listaUsuarios : "Usuario no existente";
    const medicos = listaMedicos.length > 0 ? listaMedicos : "Medico no existente";
    const hospitales = listaHospitales.length > 0 ? listaHospitales : "Hospital no existente";
    const pacientes = listaPacientes.length > 0 ? listaPacientes : "Paciente no existente";

    try {

        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales,
            pacientes
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        });
    }
}

const getColeccion = async (req, res = response) => {
    const getTabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    let map = {
        'usuarios': await Usuario.find({ nombre: regex }),
        'medicos': await Medico.find({ nombre: regex })
            .populate('usuario', 'nombre imagen')
            .populate('hospital', 'nombre img'),
        'hospitales': await Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre imagen'),
        'pacientes': await Paciente.find({ nombre: regex })
            .populate('usuario', 'nombre imagen'),
    }

    const coleccion = map[getTabla];   

    try {
        if (coleccion.length == 0) {
            return res.status(404).json({
                ok: false,
                msg: "No existe ningun registro relacionado a esa busqueda"
            });

        }

        res.json({
            "ok": true,
            coleccion
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        });

    }

}

module.exports = {
    busqueda,
    getColeccion
}