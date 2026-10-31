import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MatchMascotas from './MatchMascotas';

function Catalogo() {
  const [mascotas, setMascotas] = useState([]);
  const [mascotasIniciales, setMascotasIniciales] = useState(null);
  const [especiesDisponibles, setEspeciesDisponibles] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [especieSeleccionada, setEspecieSeleccionada] = useState('');
  const [cargandoMascotas, setCargandoMascotas] = useState(true);
  const [errorMascotas, setErrorMascotas] = useState('');
  const [solicitudesUsuario, setSolicitudesUsuario] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [mensajeMotivacion, setMensajeMotivacion] = useState('');
  const [pestana, setPestana] = useState('catalogo'); // 'catalogo' o 'misSolicitudes'

  const nombre = localStorage.getItem('nombre');

  useEffect(() => {
    let cancelado = false;

    const cargarMascotasIniciales = async () => {
      setCargandoMascotas(true);
      setErrorMascotas('');
      try {
        const res = await axios.get('http://localhost:8080/api/mascotas/disponibles');
        if (cancelado) return;

        const mascotasCargadas = res.data;
        const especies = [...new Set(mascotasCargadas.map((mascota) => mascota.especie))]
          .sort((a, b) => a.localeCompare(b));
        setMascotasIniciales(mascotasCargadas);
        setMascotas(mascotasCargadas);
        setEspeciesDisponibles(especies);
      } catch (err) {
        if (!cancelado) {
          setErrorMascotas('No fue posible cargar el catálogo. Inténtalo de nuevo.');
        }
      } finally {
        if (!cancelado) setCargandoMascotas(false);
      }
    };

    cargarMascotasIniciales();
    cargarMisSolicitudes();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!especieSeleccionada) {
      if (mascotasIniciales === null) return undefined;

      setMascotas(mascotasIniciales);
      setErrorMascotas('');
      setCargandoMascotas(false);
      return undefined;
    }

    let cancelado = false;
    const cargarPorEspecie = async () => {
      setCargandoMascotas(true);
      setErrorMascotas('');
      try {
        const res = await axios.get('http://localhost:8080/api/mascotas/filtrar', {
          params: { especie: especieSeleccionada }
        });
        if (!cancelado) setMascotas(res.data);
      } catch (err) {
        if (!cancelado) {
          setErrorMascotas('No fue posible filtrar las mascotas. Inténtalo de nuevo.');
        }
      } finally {
        if (!cancelado) setCargandoMascotas(false);
      }
    };

    cargarPorEspecie();
    return () => {
      cancelado = true;
    };
  }, [especieSeleccionada, mascotasIniciales]);

  const mascotasFiltradas = useMemo(() => {
    const busquedaNormalizada = terminoBusqueda.trim().toLocaleLowerCase();
    if (!busquedaNormalizada) return mascotas;

    return mascotas.filter((mascota) =>
      mascota.nombre.toLocaleLowerCase().includes(busquedaNormalizada)
    );
  }, [mascotas, terminoBusqueda]);

  const cargarMisSolicitudes = async () => {
    const res = await axios.get('http://localhost:8080/api/solicitudes');
    setSolicitudesUsuario(res.data);
  };

  const abrirModalAdopcion = (mascota) => {
    setMascotaSeleccionada(mascota);
    setModalAbierto(true);
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/solicitudes', {
        usuario: { id: 2 }, // ID del usuario estándar en la BD
        mascota: { id: mascotaSeleccionada.id },
        mensaje: mensajeMotivacion
      });
      alert('🎉 ¡Solicitud enviada con éxito!');
      setModalAbierto(false);
      setMensajeMotivacion('');
      cargarMisSolicitudes();
    } catch (err) {
      alert('Error al enviar la solicitud.');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Corporativo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Mascota Nexus
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-slate-600">Hola, <strong className="text-slate-900">{nombre}</strong></span>
            <button 
              onClick={cerrarSesion} 
              className="text-sm text-red-600 hover:text-red-700 font-semibold transition">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navegación por pestañas */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex space-x-4 border-b border-slate-200">
          <button
            onClick={() => setPestana('catalogo')}
            className={`pb-3 font-semibold text-sm transition border-b-2 ${
              pestana === 'catalogo'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            🐕 Mascotas Disponibles
          </button>
          <button
            onClick={() => setPestana('misSolicitudes')}
            className={`pb-3 font-semibold text-sm transition border-b-2 ${
              pestana === 'misSolicitudes'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            📋 Mis Postulaciones ({solicitudesUsuario.length})
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {pestana === 'catalogo' ? (
          <div>
            {/* Componente MatchMascotas arriba del catálogo */}
            <MatchMascotas />

            <h2 className="text-xl font-bold text-slate-800 mb-6">Encuentra a tu nuevo compañero</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5">
              <div>
                <label htmlFor="buscar-mascota" className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Buscar por nombre
                </label>
                <input
                  id="buscar-mascota"
                  type="search"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Ej. Luna"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label htmlFor="filtrar-especie" className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Filtrar por especie
                </label>
                <select
                  id="filtrar-especie"
                  value={especieSeleccionada}
                  onChange={(e) => setEspecieSeleccionada(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  <option value="">Todas las especies</option>
                  {especiesDisponibles.map((especie) => (
                    <option key={especie} value={especie}>{especie}</option>
                  ))}
                </select>
              </div>
            </div>

            {cargandoMascotas ? (
              <p className="rounded-xl bg-white px-4 py-6 text-center text-sm font-medium text-slate-700" role="status">
                Cargando mascotas...
              </p>
            ) : errorMascotas ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm font-medium text-red-800" role="alert">
                {errorMascotas}
              </p>
            ) : mascotasFiltradas.length === 0 ? (
              <p className="rounded-xl bg-white px-4 py-6 text-center text-sm font-medium text-slate-700" role="status">
                No se encontraron mascotas que coincidan con los filtros.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mascotasFiltradas.map((m) => (
                  <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between">
                    <div>
                      <img
                        src={m.imagenUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500"}
                        alt={m.nombre}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-slate-900">{m.nombre}</h3>
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {m.estado}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-1"><strong>Especie:</strong> {m.especie}</p>
                        <p className="text-slate-600 text-sm"><strong>Edad:</strong> {m.edad} {m.edad === 1 ? 'año' : 'años'}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => abrirModalAdopcion(m)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-sm">
                        Postularme para Adopción
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Historial de Postulaciones</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Mascota</th>
                    <th className="px-6 py-4">Mensaje enviado</th>
                    <th className="px-6 py-4">Estado de la Postulación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {solicitudesUsuario.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{s.mascota?.nombre}</td>
                      <td className="px-6 py-4">{s.mensaje}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          s.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                          s.estado === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {s.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Postulación */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Postularse para adoptar a {mascotaSeleccionada?.nombre}</h3>
            <p className="text-sm text-slate-600 mb-4">Escribe un breve mensaje explicando por qué quieres adoptar y las condiciones de tu hogar.</p>
            <form onSubmit={enviarSolicitud}>
              <textarea 
                rows="4"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-4"
                placeholder="Ej. Tengo espacio en casa, tiempo libre para pasearlo y mucho cariño para darle..."
                value={mensajeMotivacion}
                onChange={(e) => setMensajeMotivacion(e.target.value)}
                required
              />
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl">
                  Enviar Postulación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Catalogo;