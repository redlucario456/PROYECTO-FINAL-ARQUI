const express = require('express');
const router = express.Router();
const Mensaje = require('../models/Mensaje');

// 1. GUARDAR UN MENSAJE NUEVO (POST /api/mensajes)
router.post('/', async (req, res) => {
    try {
        const { remitente, email, contenido } = req.body;
        const nuevoMensaje = await Mensaje.create({ 
            remitente, 
            email, 
            contenido 
        });
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error("❌ Error en Buzón (POST):", error);
        res.status(500).json({ error: "No se pudo enviar el mensaje" });
    }
});

// 2. OBTENER TODOS LOS MENSAJES (GET /api/mensajes)
router.get('/', async (req, res) => {
    try {
        const mensajes = await Mensaje.findAll({ 
            order: [['createdAt', 'DESC']] 
        });
        res.json(mensajes);
    } catch (error) {
        console.error("❌ Error al leer el buzón (GET):", error);
        res.status(500).json({ error: "Error al leer el buzón" });
    }
});

// 3. BORRAR MENSAJE (DELETE /api/mensajes/:id) - ¡ESTA ES LA QUE FALTABA!
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Mensaje.destroy({ 
            where: { id: id } 
        });

        if (resultado) {
            res.json({ success: true, mensaje: "Mensaje eliminado correctamente" });
        } else {
            res.status(404).json({ error: "El mensaje no existe en la base de datos" });
        }
    } catch (error) {
        console.error("❌ Error al borrar mensaje (DELETE):", error);
        res.status(500).json({ error: "No se pudo eliminar el mensaje" });
    }
});

module.exports = router;