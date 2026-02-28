const { Sequelize } = require('sequelize');

// Usamos process.env para que Railway inyecte los datos automáticamente
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'railway', 
    process.env.MYSQLUSER || 'root', 
    process.env.MYSQLPASSWORD || 'egtzCFxYkScoKYDyCqseUbuPIJbOwbuU', 
    {
        host: process.env.MYSQLHOST || 'crossover.proxy.rlwy.net',
        port: process.env.MYSQLPORT || 33661,
        dialect: 'mysql',
        logging: false,
        // Esto ayuda a mantener la conexión estable en la nube
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate()
    .then(() => console.log('✅ Base de datos ArquiBOSS conectada correctamente.'))
    .catch(err => console.error('❌ Error de conexión:', err.message));

module.exports = sequelize;