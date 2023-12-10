const { response } = require('express');
const Paciente = require('../models/pacientes');
const Medico = require('../models/medicos');
const Cita = require('../models/cita-medica')

const getCitas = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    // const medicos = await Medico
    const [citas, total] = await Promise.all([        
        Cita
            .find({ status: 'activo' }) // Filtrar por status activo
            .populate('paciente', 'nombre apellido fechaNacimiento direccion email status img')
            .populate('medico', 'nombre apellido especialidad img')
            .sort({ fechaCita: 1 }) // Ordenar por fechaCita de la más antigua a la más reciente
            .skip(desde)
            .limit(5),
        Cita.count({ status: 'activo' }) // Contar solo los elementos con status activo


    ])

    res.json({
        ok: true,
        citas,
        total
    });
};


const getCitasPorPaciente = async (req, res = response) => {        
    const pacienteId = req.params.id;
    // const desde = Number(req.query.desde) || 0;
    try {
        const [citas, total] = await Promise.all([
            Cita
                .find({ paciente: pacienteId, status: 'activo' }) // Filtrar por ID del paciente y status activo
                .populate('paciente', 'nombre apellido fechaNacimiento direccion email status img')
                .populate('medico', 'nombre apellido especialidad img')
                .sort({ fechaCita: 1 }), // Ordenar por fechaCita de la más antigua a la más reciente                
            Cita.count({ paciente: pacienteId, status: 'activo' }) // Contar solo los elementos con ID del paciente y status activo
        ]);               
        res.json({
            ok: true,
            citas,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las citas del paciente',
            error: error.message
        });
    }
};

const getCitasPorMedico = async (req, res = response) => {
    const medicoId = req.params.id;
    // const desde = Number(req.query.desde) || 0;

    try {
        const [citas, total] = await Promise.all([
            Cita
                .find({ medico: medicoId, status: 'activo' }) // Filtrar por ID del médico y status activo
                .populate('paciente', 'nombre apellido fechaNacimiento direccion email status img')
                .populate('medico', 'nombre apellido especialidad img')
                .sort({ fechaCita: 1 }) // Ordenar por fechaCita de la más antigua a la más reciente
                // .skip(desde)
                .limit(5),
            Cita.count({ medico: medicoId, status: 'activo' }) // Contar solo los elementos con ID del médico y status activo
        ]);        

        res.json({
            ok: true,
            citas,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las citas del médico',
            error: error.message
        });
    }
};


const getCitaById = async (req, res = response) => {
    try {
        const id = req.params.id;
        const cita = await Cita.findById(id)
            .populate('paciente', 'nombre apellido fechaNacimiento direccion email status img')
            .populate('medico', 'nombre apellido especialidad img')

        res.json({
            ok: true,
            cita
        });

    } catch (error) {
        res.json({
            error: error
        });

    }

};

const crearCita = async (req, res = response) => {
    const cita = new Cita(
        {
            usuario: req.uid,
            ...req.body

        });
    console.log(cita)
    try {
        const citaDB = await cita.save();
        res.json({
            ok: true,
            cita: citaDB
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        });

    }

};

const actualizarCita = async (req, res = response) => {

    try {
        const id = req.params.id;
        const uid = req.uid;
        const cita = await Cita.findById(id);
        const medico = await Medico.findById(req.body.medico);
        const paciente = await Paciente.findById(req.body.paciente);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: "El medico no existe"
            });
        }
        if (!paciente) {
            return res.status(404).json({
                ok: false,
                msg: "El paciente no existe"
            });
        }
        if (!cita) {

            return res.status(404).json({
                ok: false,
                msg: "El cita no existe"
            });
        }

        const cambiosCita = {
            ...req.body,
            usuario: uid
        }

        const citaActualizada = await Cita.findByIdAndUpdate(id, cambiosCita, { new: true });

        res.json({
            ok: true,
            citaActualizada
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
};

const eliminarCita = async (req, res = response) => {
    try {
        const id = req.params.id;
        const cita = await Cita.findById(id);

        if (!cita) {

            return res.status(404).json({
                ok: false,
                msg: "La cita no existe"
            });
        }

        await Cita.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Cita medica borrada"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
};

module.exports = {
    getCitas,
    getCitaById,
    crearCita,
    actualizarCita,
    eliminarCita,
    getCitasPorPaciente,
    getCitasPorMedico
}