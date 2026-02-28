const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

// --- 1. CONFIGURACIÓN DE CARPETAS ---
const uploadsPath = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// --- 2. MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Servir archivos del backend (imágenes)
app.use('/uploads', express.static(uploadsPath));

// --- 3. RUTAS DE LA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clima', require('./routes/climaRoutes'));
app.use('/api/proyectos', require('./routes/proyectoRoutes'));
app.use('/api/mensajes', require('./routes/mensajeRoutes'));

// --- 4. CONFIGURACIÓN DEL FRONTEND (Rutas Blindadas) ---
// Intentamos detectar la carpeta 'public' de dos formas para asegurar Railway
const frontendPath = fs.existsSync(path.join(__dirname, 'public')) 
    ? path.join(__dirname, 'public') 
    : path.join(process.cwd(), 'server', 'public');

app.use(express.static(frontendPath));

// --- 5. MANEJO DE RUTAS NO ENCONTRADAS ---
app.use('/api', (req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada" });
});

// CAPTURA TODO (*) - Esto sirve el index.html para React
app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Mensaje de diagnóstico para saber qué está viendo el servidor realmente
        res.status(404).send(`
            <h1>ArquiBOSS Error</h1>
            <p>El servidor está ONLINE, pero no encuentra los archivos de la web.</p>
            <p><b>Ruta buscada:</b> ${indexPath}</p>
            <p><b>Carpeta actual:</b> ${__dirname}</p>
        `);
    }
});

// --- 6. ARRANQUE DEL SISTEMA ---
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => { // Agregamos '0.0.0.0' para asegurar visibilidad
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