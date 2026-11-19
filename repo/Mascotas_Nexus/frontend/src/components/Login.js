import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

function Login({ onLoginSuccess }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);

    try {
      if (esRegistro) {
        await axios.post(`${API_BASE_URL}/auth/register`, {
          nombre,
          email,
          password,
          rol: 'ROLE_USER'
        });
        setMensaje('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setEsRegistro(false);
      } else {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password
        });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('nombre', response.data.nombre);
        localStorage.setItem('rol', response.data.rol);
        localStorage.setItem('usuarioId', response.data.usuarioId);
        
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(esRegistro
        ? 'No fue posible crear la cuenta. Verifica tus datos e inténtalo de nuevo.'
        : 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-100 px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-teal-200/50 blur-3xl" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-emerald-950/10 md:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden min-h-[570px] flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-950 p-10 text-white md:flex">
          <div aria-hidden="true" className="absolute -bottom-16 -right-16 text-[250px] leading-none opacity-[0.08]">🐾</div>
          <div className="relative">
            <div className="mb-12 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-3xl" aria-hidden="true">🐾</span>
              <span className="text-xl font-extrabold tracking-tight">Mascota Nexus</span>
            </div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">Un hogar cambia una vida</p>
            <h1 className="max-w-sm text-4xl font-extrabold leading-tight">
              Encuentra a tu nuevo mejor amigo.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-emerald-50/85">
              Conecta con mascotas que esperan una familia y acompáñalas en el comienzo de una nueva historia.
            </p>
          </div>
          <p className="relative text-sm text-emerald-100/75">
            Adopta con responsabilidad. Cambia dos vidas: la suya y la tuya.
          </p>
        </aside>

        <div className="flex items-center px-6 py-10 sm:px-10 md:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 md:hidden">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-3xl" aria-hidden="true">🐾</div>
              <p className="text-sm font-bold text-emerald-700">Mascota Nexus</p>
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-emerald-700">
              {esRegistro ? 'Únete a nuestra comunidad' : 'Bienvenido de nuevo'}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {esRegistro ? 'Crea tu cuenta' : 'Inicia sesión'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {esRegistro
                ? 'Regístrate para conocer a tu próximo compañero.'
                : 'Ingresa para continuar tu camino hacia la adopción.'}
            </p>

            {error && (
              <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                {error}
              </p>
            )}
            {mensaje && (
              <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
                {mensaje}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {esRegistro && (
                <div>
                  <label htmlFor="registro-nombre" className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Nombre completo:
                  </label>
                  <input
                    id="registro-nombre"
                    type="text"
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                  />
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Email:
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Contraseña:
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete={esRegistro ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="flex w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/30 disabled:cursor-wait disabled:opacity-70"
              >
                {cargando
                  ? (esRegistro ? 'Creando cuenta...' : 'Ingresando...')
                  : (esRegistro ? 'Crear cuenta' : 'Ingresar')}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              {esRegistro ? '¿Ya tienes cuenta?' : '¿Todavía no tienes cuenta?'}
              {' '}
              <button
                type="button"
                onClick={() => { setEsRegistro(!esRegistro); setError(''); setMensaje(''); }}
                className="font-bold text-emerald-700 underline-offset-4 hover:text-emerald-900 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                {esRegistro ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;