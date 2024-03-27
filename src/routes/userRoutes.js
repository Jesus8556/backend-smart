const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users } = require('../models/user')

router.post('/register', async (req,res) =>{
    const user = new Users(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({message:error}));
});

router.post('/login', async (req,res) =>{
    try{
        const users = await Users.findOne({username : req.body.username});
        if (!users) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
          }
        
        const eq = bcrypt.compareSync(req.body.password, users.password);
  
        if (!eq) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        
        const token = jwt.sign({ userId: users._id, name:users.name }, 'secreto', { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de duración

        res.json({ token, success: 'Login correcto' });

    }catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    
   
});

router.get('/users', async (req, res) => {
    Users.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
module.exports = router