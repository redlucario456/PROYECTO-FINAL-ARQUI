const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifica que esta ruta a tu DB sea correcta

const Proyecto = sequelize.define('Proyecto', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true // Esto crea automáticamente createdAt y updatedAt
});

module.exports = Proyecto;