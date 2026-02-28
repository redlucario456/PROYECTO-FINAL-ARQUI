import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 

const ContactForm = ({ isAdmin, onRefresh, editData, setEditData }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [correo, setCorreo] = useState('');

    useEffect(() => {
        if (editData) {
            setTitulo(editData.titulo || '');
            setDescripcion(editData.descripcion || '');
            setImagenUrl(editData.imageUrl || '');
        } else {
            setTitulo('');
            setDescripcion('');
            setImagenUrl('');
            setCorreo('');
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        try {
            let res;
            // Recuperamos el token para las acciones de Admin
            const token = localStorage.getItem('token');
            
            if (isAdmin) {
                const proyectoData = {
                    nombre: titulo, 
                    descripcion: descripcion,
                    imagen: imagenUrl || "https://via.placeholder.com/400"
                };

                const url = editData 
                    ? `${API_BASE_URL}/api/proyectos/${editData.id}` 
                    : `${API_BASE_URL}/api/proyectos`;

                res = await fetch(url, {
                    method: editData ? 'PUT' : 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // ✅ ENVIAMOS EL TOKEN
                    },
                    body: JSON.stringify(proyectoData)
                });

            } else {
                const mensajeData = {
                    remitente: titulo,
                    email: correo,
                    contenido: descripcion
                };

                res = await fetch(`${API_BASE_URL}/api/mensajes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mensajeData)
                });
            }

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: editData ? 'Proyecto actualizado' : (isAdmin ? 'Proyecto publicado' : 'Mensaje enviado'),
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#1e1e1e',
                    color: '#fff'
                });

                setTitulo('');
                setDescripcion('');
                setImagenUrl('');
                setCorreo('');
                if (setEditData) setEditData(null);
                if (onRefresh) onRefresh(); 
            } else {
                const errorData = await res.json();
                // Si el servidor dice que no estamos autorizados
                if (res.status === 401) {
                    throw new Error("Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.");
                }
                throw new Error(errorData.error || "Error en la respuesta del servidor");
            }

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Operación fallida',
                text: error.message,
                background: '#1e1e1e',
                color: '#fff'
            });
        }
    };

    return (
        <section className="contact-section">
            <div className="form-header">
                <h2>{editData ? "🔧 Editar Proyecto" : (isAdmin ? "🏗️ Publicar Obra" : "✉️ Contacto Técnico")}</h2>
                {editData && <span className="edit-badge">Modo Edición Activo</span>}
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                <input 
                    type="text" 
                    placeholder={isAdmin ? "TÍTULO DE LA OBRA" : "TU NOMBRE"} 
                    value={titulo} 
                    onChange={e => setTitulo(e.target.value)} 
                    required 
                />

                {isAdmin ? (
                    <input 
                        type="text" 
                        placeholder="URL DE LA IMAGEN (Ej: https://...)" 
                        value={imagenUrl}
                        onChange={e => setImagenUrl(e.target.value)}
                        required
                    />
                ) : (
                    <input 
                        type="email" 
                        placeholder="TU CORREO ELECTRÓNICO" 
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        required 
                    />
                )}

                <textarea 
                    placeholder={isAdmin ? "MEMORIA DESCRIPTIVA" : "DETALLES DE TU CONSULTA"} 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                    required 
                />

                <div className="form-buttons">
                    <button type="submit" className={editData ? "btn-update" : "btn-enviar"}>
                        {editData ? "GUARDAR CAMBIOS" : (isAdmin ? "SUBIR PROYECTO" : "ENVIAR CONSULTA")}
                    </button>
                    
                    {editData && (
                        <button type="button" onClick={() => setEditData(null)} className="btn-cancelar">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
};

export default ContactForm;