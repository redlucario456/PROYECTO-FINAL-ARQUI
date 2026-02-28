const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto'); 

// 1. OBTENER PROYECTOS (GET)
router.get('/', async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll({ order: [['createdAt', 'DESC']] });
        res.json(proyectos); 
    } catch (error) {
        console.error("❌ Error GET:", error);
        res.status(500).json({ error: "Error al obtener proyectos" });
    }
});

// 2. CREAR PROYECTO (POST)
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, imagen } = req.body;
        
        const nuevoProyecto = await Proyecto.create({
            titulo: nombre,        // Mapeo: nombre -> titulo
            descripcion: descripcion,
            imageUrl: imagen       // Mapeo: imagen -> imageUrl
        });

        res.status(201).json(nuevoProyecto);
    } catch (error) {
        console.error("❌ Error detallado en POST:", error);
        res.status(500).json({ 
            error: "No se pudo guardar el proyecto", 
            detalle: error.message 
        });
    }
});

// 3. EDITAR PROYECTO (PUT) - ¡NUEVO!
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, imagen } = req.body;
        
        const proyecto = await Proyecto.findByPk(id);
        
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        // Actualizamos los campos con el mismo mapeo que el POST
        proyecto.titulo = nombre || proyecto.titulo;
        proyecto.descripcion = descripcion || proyecto.descripcion;
        proyecto.imageUrl = imagen || proyecto.imageUrl;

        await proyecto.save();
        res.json({ success: true, mensaje: "Proyecto actualizado", proyecto });
    } catch (error) {
        console.error("❌ Error PUT:", error);
        res.status(500).json({ error: "No se pudo editar el proyecto" });
    }
});

// 4. BORRAR PROYECTO (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Proyecto.destroy({ where: { id: id } });
        
        if (resultado) {
            res.json({ success: true, mensaje: "Proyecto eliminado" });
        } else {
            res.status(404).json({ error: "Proyecto no encontrado" });
        }
    } catch (error) {
        console.error("❌ Error DELETE:", error);
        res.status(500).json({ error: "No se pudo borrar" });
    }
});

module.exports = router;