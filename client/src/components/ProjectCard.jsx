import React from 'react';

const ProjectCard = ({ proyecto, isAdmin, onDelete, onEdit }) => {
  
  const { 
    titulo = "", 
    descripcion = "", 
    imageUrl = "" 
  } = proyecto || {};

  // Función para contactar por WhatsApp
  const contactarWhatsApp = () => {
    const numero = "528998731243"; // Tu número con el prefijo de México
    // Mensaje automático personalizado
    const mensaje = encodeURIComponent(`Hola ArquiBOSS, solicito información técnica sobre el proyecto: ${titulo}`);
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
  };

  return (
    <div className="proyecto-card" style={{
      border: '1px solid #eee',
      borderRadius: '12px',
      margin: '15px',
      backgroundColor: '#fff',
      boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
      width: '320px',
      overflow: 'hidden',
      textAlign: 'left',
      transition: 'transform 0.3s ease'
    }}>
      {/* IMAGEN DE LA OBRA */}
      {imageUrl && (
        <div style={{ width: '100%', height: '210px', overflow: 'hidden' }}>
          <img 
            src={imageUrl} 
            alt={titulo} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      <div style={{ padding: '20px' }}>
        <h3 style={{ 
          margin: '0 0 10px 0', 
          color: '#1a1a1a', 
          fontSize: '18px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {titulo}
        </h3>

        <p style={{ 
          fontSize: '14px', 
          color: '#555', 
          lineHeight: '1.6',
          margin: '0 0 15px 0'
        }}>
          {descripcion}
        </p>

        {/* 📱 BOTÓN DE WHATSAPP CON DISEÑO ELEGANTE (Solo para clientes) */}
        {!isAdmin && (
          <button 
            onClick={contactarWhatsApp}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1a1a1a', // Negro Mate Elegante
              color: '#fff', // Texto Blanco
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.3s, transform 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            // Al pasar el mouse, cambia a un gris oscuro y se eleva un poco
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#333';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#1a1a1a';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {/* Pequeño icono para identificar WhatsApp sin usar el verde de fondo */}
            <span style={{color: '#25D366', fontSize: '16px'}}>💬</span> CONSULTAR CONSULTA TÉCNICA
          </button>
        )}

        {/* 🛠️ PANEL DE CONTROL EXCLUSIVO PARA ADMIN */}
        {isAdmin && (
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '10px',
            borderTop: '1px solid #eee',
            paddingTop: '15px' 
          }}>
            <button 
              onClick={onEdit}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#2e7d32', // Verde construcción
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              ⚙️ EDITAR
            </button>
            <button 
              onClick={onDelete}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#d32f2f', // Rojo demolición
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              🗑️ BORRAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;