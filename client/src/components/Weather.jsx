import React, { useState, useEffect } from 'react';

const Weather = () => {
    const [clima, setClima] = useState(null);
    const [error, setError] = useState(false);

    const obtenerClima = async () => {
        try {
            // Conexión al backend en puerto 3000
            const response = await fetch('http://localhost:3000/api/clima?city=Reynosa');
            const data = await response.json();

            if (data && data.main) {
                setClima({
                    temp: Math.round(data.main.temp),
                    desc: data.weather[0].description,
                    ciudad: data.name
                });
                setError(false);
            }
        } catch (err) {
            console.error("Error consultando satélite:", err);
            setError(true);
        }
    };

    useEffect(() => {
        obtenerClima();
    }, []);

    if (error) return null; // Si hay error, no mostramos el cuadro para no romper la estética
    if (!clima) return <div id="climaBox"><p>Sincronizando...</p></div>;

    return (
        /* USAMOS TUS CLASES DEL CSS: #climaBox */
        <div id="climaBox">
            <p>Estado Obra / {clima.ciudad}</p>
            <span>{clima.temp}°C</span>
            <p style={{ opacity: 0.5, fontSize: '0.6rem' }}>[{clima.desc}]</p>
        </div>
    );
};

export default Weather;