import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 1. Usamos la variable de entorno para la URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password: password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('token', data.token);
                navigate('/');
                window.location.reload();
            } else {
                alert(data.message || "Datos incorrectos");
            }
        } catch (error) {
            console.error("Error al conectar:", error);
            alert("El servidor no responde. Verifica que el servidor esté encendido.");
        }
    };

    return (
        /* ESTA CLASE ES LA QUE MANDA A TODO AL CENTRO DE LA PANTALLA */
        <div className="login-page"> 
            
            <div className="login-container">
                <h2 className="login-title">Acceso ArquiBOSS</h2>
                
                <form onSubmit={handleLogin} className="login-form">
                    <input 
                        type="text" 
                        placeholder="Usuario o Email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        className="login-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        className="login-input"
                    />
                    <button type="submit" className="btn-login">Entrar</button>
                </form>

                {/* Un link para regresar por si el usuario se arrepiente */}
                <Link to="/" className="back-link">
                    ← Volver al inicio
                </Link>
            </div>

        </div>
    );
};

export default Login;