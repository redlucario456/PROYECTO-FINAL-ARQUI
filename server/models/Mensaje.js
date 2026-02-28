const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mensaje = sequelize.define('Mensaje', {
    // Coinciden exacto con tu imagen de Railway
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    remitente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Mensajes',
    timestamps: true,      // Activamos timestamps...
    updatedAt: false,      // ❌ ...pero desactivamos 'updatedAt' porque no existe en tu tabla
    createdAt: 'createdAt' // ✅ ...y le confirmamos que use tu columna 'createdAt'
});

module.exports = Mensaje;