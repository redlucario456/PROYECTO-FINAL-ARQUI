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
const frontendPath = path.join(__dirname, 'client');
app.use(express.static(frontendPath));

// --- 3. RUTAS DE LA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clima', require('./routes/climaRoutes'));
app.use('/api/proyectos', require('./routes/proyectoRoutes'));
app.use('/api/mensajes', require('./routes/mensajeRoutes'));

// --- 4. MANEJO DE RUTAS NO ENCONTRADAS ---

// A. Si la ruta empieza con /api y llegó aquí, no existe.
app.use('/api', (req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada" });
});

// B. CUALQUIER OTRA RUTA (SPA React)
app.use((req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("<h1>ArquiBOSS Error</h1><p>No se encontró el build en 'public'. Revisa si subiste la carpeta con los archivos de React.</p>");
    }
});

// --- 5. ARRANQUE DEL SISTEMA ---
// Railway inyecta el puerto automáticamente. Usamos 3000 como respaldo local.
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        // Quitamos el '0.0.0.0' explícito para que Railway maneje la interfaz de red
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
