import React, { useState } from 'react';
import Login from './components/Login';
import Catalogo from './components/Catalogo';
import AdminPanel from './components/AdminPanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const rol = localStorage.getItem('rol');

  return (
    <div>
      {!token ? (
        <Login onLoginSuccess={(datos) => setToken(datos.token)} />
      ) : (
        <div>
          {rol === 'ROLE_ADMIN' ? <AdminPanel /> : <Catalogo />}
        </div>
      )}
    </div>
  );
}

export default App;