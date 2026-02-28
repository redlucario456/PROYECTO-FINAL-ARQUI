import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import './styles.css';
import Weather from './components/Weather';
import ContactForm from './components/ContactForm';
import ProjectCard from './components/ProjectCard';


function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [proyectos, setProyectos] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [yoshi, setYoshi] = useState(false);
    const [proyectoAEditar, setProyectoAEditar] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        fetchContenido();

        let keys = [];
        const handleKeyDown = (e) => {
            keys.push(e.key);
            if (keys.length > 4) keys.shift();
            if (keys.join('') === "ArrowUpArrowUpArrowDownArrowDown") {
                setYoshi(true);
                Swal.fire({ title: '🦖 ¡Yoshi Mode!', timer: 1000, showConfirmButton: false });
            }
            if (e.key === 'Escape') {
                setYoshi(false);
                setProyectoAEditar(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [token]); 

    const fetchContenido = async () => {
        try {
            const resProyectos = await fetch(`${API_BASE_URL}/api/proyectos?t=${Date.now()}`);
            if (resProyectos.ok) {
                const datosProyectos = await resProyectos.json();
                setProyectos(datosProyectos);
            }

            if (token) {
                const resMensajes = await fetch(`${API_BASE_URL}/api/mensajes?t=${Date.now()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resMensajes.ok) {
                    const datosMensajes = await resMensajes.json();
                    setMensajes(datosMensajes);
                }
            }
        } catch (error) {
            console.error("Error cargando contenido ArquiBOSS:", error);
        }
    };

    const borrarElemento = async (id, esMensaje = false) => {
        const result = await Swal.fire({
            title: esMensaje ? '¿Eliminar consulta?' : '¿Demoler proyecto?',
            text: "Esta acción eliminará el registro permanentemente de la base de datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4757',
            cancelButtonColor: '#2f3542',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e1e1e',
            color: '#fff'
        });

        if (result.isConfirmed) {
            const endpoint = esMensaje ? 'mensajes' : 'proyectos';
            
            try {
                // ✅ AGREGAMOS EL TOKEN AL FETCH DE ELIMINACIÓN
                const res = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${token}`, // Llave de acceso
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    await Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El registro ha sido removido.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchContenido(); 
                } else {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Error al eliminar");
                }

            } catch (error) {
                console.error("Error al borrar:", error);
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
                });
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.reload();
    };

    return (
        <div className="App">
            <header>
                <h1 id="mainTitle" style={{ color: yoshi ? '#44af35' : 'white' }}>ArquiBOSS</h1>
                {!token ? (
                    <Link to="/login" className="auth-link"> Acceso Admin </Link>
                ) : (
                    <button onClick={logout} className="auth-link logout-btn">
                        Cerrar Sesión
                    </button>
                )}
            </header>

            <Weather />

            {token && (
                <div id="seccionMensajesAdmin">
                    <h2><i className="fas fa-envelope-open-text"></i> Consultas de Clientes</h2>
                    <div id="contenedorMensajes">
                        {mensajes.length > 0 ? mensajes.map(m => (
                            <div key={m.id} className="mensaje-card">
                                <div className="mensaje-texto">
                                    <strong>De: {m.remitente}</strong> 
                                    <span style={{color: '#aaa', fontSize: '0.8em', marginLeft: '10px'}}>{m.email}</span>
                                    <p>{m.contenido}</p>
                                </div>
                                <button 
                                    onClick={() => borrarElemento(m.id, true)} 
                                    className="btn-delete-mini"
                                    title="Eliminar mensaje"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )) : <p className="no-data">Buzón de entrada despejado.</p>}
                    </div>
                </div>
            )}

            <section id="proyectos">
                <h2>Portafolio de Proyectos</h2>
                <div className="proyectos-grid">
                    {proyectos.length > 0 ? proyectos.map(p => (
                        <ProjectCard 
                            key={p.id} 
                            proyecto={p} 
                            isAdmin={!!token} 
                            onRefresh={fetchContenido}
                            onDelete={() => borrarElemento(p.id, false)}
                            onEdit={() => {
                                setProyectoAEditar(p);
                                document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
                            }}
                        />
                    )) : <p className="no-data">🏗️ No hay obras registradas.</p>}
                </div>
            </section>

            <div id="form-container">
                <ContactForm 
                    isAdmin={!!token} 
                    onRefresh={fetchContenido} 
                    editData={proyectoAEditar} 
                    setEditData={setProyectoAEditar}
                    token={token} // Pasamos el token al formulario también
                />
            </div>

            {yoshi && (
                <div id="yoshi-egg">
                    <img src="https://media.giphy.com/media/Z6f79Ewt6L_t6/giphy.gif" alt="Yoshi" />
                </div>
            )}

            <footer>
                <p>&copy; 2026 ArquiBOSS - Ingeniería y Arquitectura de Alto Nivel</p>
            </footer>
        </div>
    );
}

export default App;