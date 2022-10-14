const { response } = require('express');
const Hospital = require('../models/hospital');
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
    const medico = new Medico(
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

const actualizarMedico = async (req, res = response) => {

    try {
        const id = req.params.id;
        const uid = req.uid;
        const medico = await Medico.findById(id);
        const hospital = await Hospital.findById(req.body.hospital);
        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg: "El Hospital no existe"
            });
        }
        if (!medico) {

            return res.status(404).json({
                ok: false,
                msg: "El medico no existe"
            });
        }

        const cambiosMedico = {
            ...req.body,           
            usuario: uid
        }      

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            medicoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
};

const eliminarMedico = async (req, res = response) => {
    try {
        const id = req.params.id;        
        const medico = await Medico.findById(id);
        
        if (!medico) {

            return res.status(404).json({
                ok: false,
                msg: "El medico no existe"
            });
        }          

         await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Medico borrado"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico,
}