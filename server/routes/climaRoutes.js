const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    // 1. Extraemos los datos que manda el Frontend
    const { city, lat, lon } = req.query;
const API_KEY = "c1878d474fb1a469eb193b31849ba563"; // Pegada directo

    try {
        // 2. Construimos la URL (Priorizamos GPS, luego Ciudad)
        let url;
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city || 'Reynosa'}&appid=${API_KEY}&units=metric&lang=es`;
        }

        // 3. Petición a OpenWeather
        const response = await fetch(url);
        const data = await response.json();

        // 4. Si la API KEY está vencida o mal, OpenWeather manda un error (401, 404, etc)
        if (!response.ok) {
            console.error("❌ Error de OpenWeather:", data.message);
            return res.status(response.status).json({ error: data.message });
        }

        // 5. Si todo está bien, mandamos el JSON real
        res.json(data);

    } catch (error) {
        console.error("❌ Error en el servidor de clima:", error);
        res.status(500).json({ error: "Falla de conexión con el satélite" });
    }
});

module.exports = router;