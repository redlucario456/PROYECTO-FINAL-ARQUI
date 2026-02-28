import React, { useState, useEffect } from 'react';

const MensajesAdmin = () => {
    const [mensajes, setMensajes] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const obtenerMensajes = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/mensajes`);
            if (res.ok) {
                const data = await res.json();
                setMensajes(data);
            }
        } catch (error) {
            console.error("Error al obtener mensajes:", error);
        }
    };

    useEffect(() => {
        obtenerMensajes();
        // Opcional: Recargar cada 30 segundos para ver mensajes nuevos
        const intervalo = setInterval(obtenerMensajes, 30000);
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3 style={{ color: '#333', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                📩 Consultas de Clientes
            </h3>
            {mensajes.length === 0 ? (
                <p>No hay mensajes nuevos en el buzón.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#333', color: 'white' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Mensaje</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mensajes.map((m) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{m.remitente}</td>
                                    <td style={{ padding: '10px' }}>{m.email}</td>
                                    <td style={{ padding: '10px' }}>{m.contenido}</td>
                                    <td style={{ padding: '10px', fontSize: '0.85em' }}>
                                        {new Date(m.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MensajesAdmin;