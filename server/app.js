const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

// --- 1. CONFIGURACIÓN DE CARPETAS ---
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

// --- 2. MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Servir archivos estáticos del backend
app.use('/uploads', express.static(uploadsPath));

// Ruta del Frontend (Asegúrate de que tu build esté en la carpeta 'public')
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));

// --- 3. RUTAS DE LA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clima', require('./routes/climaRoutes'));
app.use('/api/proyectos', require('./routes/proyectoRoutes'));
app.use('/api/mensajes', require('./routes/mensajeRoutes'));

// --- 4. MANEJO DE RUTAS NO ENCONTRADAS (ESTILO EXPRESS 5 / NODE v24) ---
// En lugar de usar strings con '*', usamos middlewares directos.

// A. Si la ruta empieza con /api y llegó aquí, no existe.
app.use('/api', (req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada" });
});

// B. CUALQUIER OTRA RUTA (SPA React)
// Este middleware se ejecuta si ninguna ruta anterior (API o Estáticos) coincidió.
app.use((req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("<h1>ArquiBOSS Error</h1><p>No se encontró el build en 'public'.</p>");
    }
});

// --- 5. ARRANQUE DEL SISTEMA ---
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log('-------------------------------------------');
            console.log(`✅ BASE DE DATOS: Conectada`);
            console.log(`🚀 SERVIDOR ARQUIBOSS: Puerto ${PORT}`);
            console.log('-------------------------------------------');
        });
    })
    .catch(err => {
        console.error('❌ Error de sincronización:', err);
    });