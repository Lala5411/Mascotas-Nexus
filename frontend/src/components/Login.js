import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (esRegistro) {
      // Proceso de Registro
      try {
        await axios.post('http://localhost:8080/api/auth/register', {
          nombre,
          email,
          password,
          rol: 'ROLE_USER'
        });
        setMensaje('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setEsRegistro(false);
      } catch (err) {
        setError('Error al registrar usuario. Verifica los datos.');
      }
    } else {
      // Proceso de Login
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password
        });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('nombre', response.data.nombre);
        localStorage.setItem('rol', response.data.rol);
        
        onLoginSuccess(response.data);
      } catch (err) {
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Mascota Nexus - {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        {esRegistro && (
          <div style={{ marginBottom: '15px' }}>
            <label>Nombre Completo:</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input 
            type="password" 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {esRegistro ? 'Crear Cuenta' : 'Ingresar'}
        </button>
      </form>

      <button 
        onClick={() => { setEsRegistro(!esRegistro); setError(''); setMensaje(''); }}
        style={{ marginTop: '15px', background: 'none', border: 'none', color: '#008CBA', cursor: 'pointer', textDecoration: 'underline', width: '100%' }}>
        {esRegistro ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
      </button>
    </div>
  );
}

export default Login;