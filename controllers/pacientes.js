const { response } = require('express');
const Paciente = require('../models/pacientes');
const { format } = require("date-fns");


const getPacientes = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [pacientes, total] = await Promise.all([
        Paciente
            .find()
            // .populate('paciente', 'nombre apellido fechaNacimiento genero direccion telefono email img')
            .populate('usuario', 'nombre email img')        
            .skip(desde)
            .limit(5),
        Paciente.count()
    ])

    res.json({
        ok: true,
        pacientes,
        total
    });
}

const getPacienteById = async (req, res = response) => {
    try {
        const id = req.params.id;
        const paciente = await Paciente.findById(id)
            .populate('usuario', 'nombre email img')
            res.json({
                ok: true,
                paciente                
            });
        
    } catch (error) {        
        res.json({
            error: error
        });
        
    }

}

const crearPaciente = async (req, res = response) => {
    
    // const fechaNacimiento = req.body.fechaNacimiento;    
    // req.body.fechaNacimiento = format(new Date(fechaNacimiento), "yyyy-MM-dd");    
    const paciente = new Paciente(
        {
            usuario: req.uid,
            ...req.body

        });

    
    console.log(req.uid)
    console.log(req.body)
    try {
        const pacienteDB = await paciente.save();
        console.log("Listo")
        res.json({
            ok: true,
            paciente: pacienteDB
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        });

    }

};

const actualizarPaciente = async (req, res = response) => {

    try {
        const id = req.params.id;
        const uid = req.uid;
        const paciente = await Paciente.findById(id);
        console.log(req)
        if (!paciente) {
            return res.status(404).json({
                ok: false,
                msg: "El paciente no existe"
            });
        }        
        const cambiosPaciente = {
            ...req.body,
            usuario: uid
        }

        const pacienteActualizado = await Paciente.findByIdAndUpdate(id, cambiosPaciente, { new: true });

        res.json({
            ok: true,
            pacienteActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
};

const eliminarPaciente = async (req, res = response) => {
    try {
        const id = req.params.id;
        const paciente = await Paciente.findById(id);

        if (!paciente) {

            return res.status(404).json({
                ok: false,
                msg: "El paciente no existe"
            });
        }        
        await Paciente.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Paciente borrado"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
};
module.exports = {
    getPacientes,
    getPacienteById,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
}