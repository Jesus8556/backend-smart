const express = require("express");
const router = express.Router();
const { Users, Garages } = require('../models/user')
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secreto', (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.userId = decodedToken.userId;
        next();
    });
}
router.get('/allgarage', async(req,res) =>{
    Garages
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

})
router.get('/garage',verificarToken, async(req,res) =>{
    try {
        const garages = await Garages.find({ user: req.userId });
        res.json(garages);
    } catch (error) {
        console.error('Error al obtener garages:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }    
})
router.post('/garage', verificarToken, async (req, res) => {
    try {
        const newGarage = new Garages({
            address: req.body.address,
            description: req.body.description,
            isAvailable: req.body.isAvailable,
            pricePerHour: req.body.pricePerHour,
            user: req.userId // Asociamos el garage al usuario actual
        });

        await newGarage.save();
        res.status(201).json({ message: 'Garage creado exitosamente' });
    } catch (error) {
        console.error('Error al crear garage:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.put('/garage/:id', verificarToken, async (req, res) => {
    try {
        const garageId = req.params.id;
        const updates = req.body;

        // Verificar si el usuario tiene permiso para actualizar este garage
        const garage = await Garages.findOne({ _id: garageId, user: req.userId });
        if (!garage) {
            return res.status(404).json({ error: 'Garage no encontrado' });
        }

        // Actualizar el garage
        await Garages.findByIdAndUpdate(garageId, updates);

        res.json({ message: 'Garage actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar garage:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/garage/:id', verificarToken, async (req, res) => {
    try {
        const garageId = req.params.id;

        // Verificar si el usuario tiene permiso para eliminar este garage
        const garage = await Garages.findOne({ _id: garageId, user: req.userId });
        if (!garage) {
            return res.status(404).json({ error: 'Garage no encontrado' });
        }

        // Eliminar el garage
        await Garages.findByIdAndDelete(garageId);

        res.json({ message: 'Garage eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar garage:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



module.exports = router