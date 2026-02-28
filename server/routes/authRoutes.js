const express = require('express'); //
const router = express.Router(); //
const Usuario = require('../models/usuario'); //
const jwt = require('jsonwebtoken'); //

// Aquí empieza lo que pegaste antes:
router.post('/login', async (req, res) => {
    const { username, password } = req.body; 
    
    try {
        const usuario = await Usuario.findOne({ 
            where: { 
                username: username, 
                password: password 
            } 
        });

        if (!usuario) {
            return res.status(401).json({ success: false, message: "Datos incorrectos" });
        }

        const secret = process.env.JWT_SECRET || 'clave_secreta_provisional';
        const token = jwt.sign({ id: usuario.id }, secret, { expiresIn: '2h' });

        res.json({ success: true, token });

    } catch (err) { 
        console.error("Error en login:", err);
        res.status(500).json({ success: false, message: err.message }); 
    }
});

module.exports = router; //