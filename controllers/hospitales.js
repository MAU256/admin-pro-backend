const { response, json } = require('express');
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


const actualizarHospital = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const hospital = await Hospital.findById(id);
        if(!hospital){
            return res.status(404).json({
                ok:false,
                msg: "Hospital no encontrado"
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});


        res.json({
            ok: true,
            hospitalActualizado
    
        });
        
    } catch (error) {
       return res.status(500).json({
            ok: false,
            error
        });
        
    }
}

const borrarHospital = async (req, res = response) => {
    const id = req.params.id;
    
    try {
        const hospital = await Hospital.findById(id);
        if(!hospital){
            return res.status(404).json({
                ok:false,
                msg: "Hospital no encontrado"
            });
        }

        
        await Hospital.findByIdAndDelete(id);


        res.json({
            ok: true,
            msg: 'Hospital eliminado',   
        });
        
    } catch (error) {
       return res.status(500).json({
            ok: false,
            error
        });
        
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}