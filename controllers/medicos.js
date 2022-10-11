const { response } = require('express');
const Medico = require('../models/medicos');

const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find()
                                .populate('usuario', 'nombre email img')
                                .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
};

const crearMedico = async (req, res = response) => {
    const medico = new Medico (
                        {
                            usuario: req.uid,
                            ...req.body

                        });    
    try {
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        });

    }

};

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    });
};

const eliminarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'eliminarMedico'
    });
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico,
}