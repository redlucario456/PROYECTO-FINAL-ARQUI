const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

// --- 1. CONFIGURACIÓN DE CARPETAS ---
// Usamos path.resolve para evitar problemas de rutas relativas en Linux/Railway
const uploadsPath = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// --- 2. MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Servir archivos del backend (imágenes subidas)
app.use('/uploads', express.static(uploadsPath));

// --- 3. RUTAS DE LA API ---
// Definimos las rutas de la API ANTES de los archivos estáticos del frontend
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clima', require('./routes/climaRoutes'));
app.use('/api/proyectos', require('./routes/proyectoRoutes'));
app.use('/api/mensajes', require('./routes/mensajeRoutes'));

// --- 4. CONFIGURACIÓN DEL FRONTEND (React Build) ---
const frontendPath = path.resolve(__dirname, 'public');

// Servimos los archivos estáticos de la carpeta public
app.use(express.static(frontendPath));

// MANEJO DE RUTAS NO ENCONTRADAS (SPA Friendly)
// A. Si la ruta empieza con /api y no coincidió con nada, damos error 404 de API
app.use('/api', (req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada" });
});

// B. Para cualquier otra ruta (como /dashboard, /login), servimos el index.html
// Esto es vital para que al recargar la página en React no de error
app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("<h1>ArquiBOSS Error</h1><p>No se encontró el build en 'public'. Verifica que moviste los archivos de dist a server/public.</p>");
    }
});

// --- 5. ARRANQUE DEL SISTEMA ---
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log('-------------------------------------------');
            console.log(`✅ BASE DE DATOS: Conectada`);
            console.log(`🚀 SERVIDOR ARQUIBOSS ONLINE`);
            console.log(`📡 Puerto: ${PORT}`);
            console.log('-------------------------------------------');
        });
    })
    .catch(err => {
        console.error('❌ Error de sincronización con la DB:', err);
    });