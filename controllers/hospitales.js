const { response } = require('express');
const Hospital = require('../models/hospital');


const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre email img');
    res.json({
        ok:true,
        hospitales
    })

};

const crearHospital = async (req, res = response) => {
    const hospital = new Hospital(
                        {
                            usuario: req.uid,
                            ...req.body
                        });
    const uid = req.uid;

    try {
        
       const hospitalDB =  await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        });
        
    }
   
}


const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: "actualizarHospitales"

    });
}

const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: "borrarHospital"
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}