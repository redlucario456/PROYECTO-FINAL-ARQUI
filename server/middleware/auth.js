const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Extraer el token del header "Authorization: Bearer TOKEN"
        const token = req.headers.authorization.split(' ')[1];
        
        // USAR LA MISMA LÓGICA QUE EN LOGIN
        const secret = process.env.JWT_SECRET || 'ArquiBoss_Master_Key_2026';
        
        const decodedToken = jwt.verify(token, secret);
        
        // Guardamos los datos del admin en la petición por si los necesitamos
        req.userData = decodedToken;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Acceso denegado. Token inválido o expirado.' });
    }
};