import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

function Catalogo() {
  const [mascotas, setMascotas] = useState([]);
  const [mascotasIniciales, setMascotasIniciales] = useState(null);
  const [especiesDisponibles, setEspeciesDisponibles] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [especieSeleccionada, setEspecieSeleccionada] = useState('');
  const [orden, setOrden] = useState('');
  const [cargandoMascotas, setCargandoMascotas] = useState(true);
  const [errorMascotas, setErrorMascotas] = useState('');
  const [errorSolicitudes, setErrorSolicitudes] = useState('');
  const [solicitudesUsuario, setSolicitudesUsuario] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [mensajeMotivacion, setMensajeMotivacion] = useState('');
  const [tipoVivienda, setTipoVivienda] = useState('');
  const [horasLibres, setHorasLibres] = useState('');
  const [nivelActividad, setNivelActividad] = useState('');
  const [afinidad, setAfinidad] = useState(null);
  const [cargandoAfinidad, setCargandoAfinidad] = useState(false);
  const [cargandoSolicitud, setCargandoSolicitud] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [pestana, setPestana] = useState('catalogo'); // 'catalogo' o 'misSolicitudes'
  const [errorCancelacion, setErrorCancelacion] = useState('');
  const [cancelandoId, setCancelandoId] = useState(null);

  const nombre = localStorage.getItem('nombre');
  const usuarioId = localStorage.getItem('usuarioId');

  const cargarMisSolicitudes = useCallback(async () => {
    if (!usuarioId) {
      setSolicitudesUsuario([]);
      setErrorSolicitudes('Vuelve a iniciar sesión para cargar tus postulaciones.');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/solicitudes/usuario/${usuarioId}`);
      setSolicitudesUsuario(res.data);
      setErrorSolicitudes('');
    } catch (err) {
      setErrorSolicitudes('No fue posible cargar tus postulaciones. Inténtalo de nuevo.');
    }
  }, [usuarioId]);

  const cancelarSolicitud = async (solicitud) => {
    setCancelandoId(solicitud.id);
    setErrorCancelacion('');
    try {
      const res = await axios.put(
        `${API_BASE_URL}/solicitudes/${solicitud.id}/cancelar`,
        null,
        { params: { usuarioId } }
      );
      setSolicitudesUsuario((actuales) => actuales.map((s) => (s.id === solicitud.id ? res.data : s)));
    } catch (err) {
      setErrorCancelacion(`No fue posible cancelar la solicitud de ${solicitud.mascotaNombre}. Actualiza el historial e inténtalo de nuevo.`);
    } finally {
      setCancelandoId(null);
    }
  };

  useEffect(() => {
    let cancelado = false;

    const cargarMascotasIniciales = async () => {
      setCargandoMascotas(true);
      setErrorMascotas('');
      try {
        const res = await axios.get(`${API_BASE_URL}/mascotas/disponibles`);
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
  }, [cargarMisSolicitudes]);

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
        const res = await axios.get(`${API_BASE_URL}/mascotas/filtrar`, {
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
    const filtradas = busquedaNormalizada
      ? mascotas.filter((mascota) => mascota.nombre.toLocaleLowerCase().includes(busquedaNormalizada))
      : mascotas;

    if (!orden) return filtradas;

    const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    const comparadores = {
      'nombre-asc': porNombre,
      'edad-asc': (a, b) => (a.edad - b.edad) || porNombre(a, b),
      'edad-desc': (a, b) => (b.edad - a.edad) || porNombre(a, b)
    };
    return [...filtradas].sort(comparadores[orden]);
  }, [mascotas, terminoBusqueda, orden]);

  const abrirModalAdopcion = (mascota) => {
    setMascotaSeleccionada(mascota);
    setMensajeMotivacion('');
    setTipoVivienda('');
    setHorasLibres('');
    setNivelActividad('');
    setAfinidad(null);
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cambiarRespuestaHogar = (actualizar) => (e) => {
    actualizar(e.target.value);
    setAfinidad(null);
    setErrorFormulario('');
  };

  const calcularAfinidad = async () => {
    const horas = Number(horasLibres);
    if (!tipoVivienda || !Number.isInteger(horas) || horas < 1 || horas > 12 || !nivelActividad) {
      setErrorFormulario('Completa los datos del hogar con valores válidos para calcular la afinidad.');
      return;
    }

    setCargandoAfinidad(true);
    setErrorFormulario('');
    setAfinidad(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/match`, {
        tipoVivienda,
        horasLibres: horas,
        nivelActividad
      });
      const resultado = res.data.find(
        (item) => item.mascota.id === mascotaSeleccionada.id
      );
      if (!resultado) {
        setErrorFormulario('No fue posible calcular afinidad: esta mascota ya no está disponible.');
        return;
      }
      setAfinidad(resultado);
    } catch (err) {
      setErrorFormulario('No fue posible calcular la afinidad. Puedes enviar la postulación igualmente.');
    } finally {
      setCargandoAfinidad(false);
    }
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      setErrorSolicitudes('Vuelve a iniciar sesión para postularte a una mascota.');
      return;
    }

    const horas = Number(horasLibres);
    if (!tipoVivienda
      || !Number.isInteger(horas)
      || horas < 1
      || horas > 12
      || !nivelActividad
      || !mensajeMotivacion.trim()) {
      setErrorFormulario('Completa todos los campos para enviar la postulación.');
      return;
    }

    setCargandoSolicitud(true);
    setErrorFormulario('');
    try {
      await axios.post(`${API_BASE_URL}/solicitudes`, {
        usuario: { id: Number(usuarioId) },
        mascota: { id: mascotaSeleccionada.id },
        mensaje: mensajeMotivacion.trim(),
        tipoVivienda,
        horasLibres: horas,
        nivelActividad
      });
      alert('🎉 ¡Solicitud enviada con éxito!');
      setModalAbierto(false);
      setMensajeMotivacion('');
      setTipoVivienda('');
      setHorasLibres('');
      setNivelActividad('');
      setAfinidad(null);
      await cargarMisSolicitudes();
    } catch (err) {
      setErrorFormulario('No fue posible enviar la postulación. Inténtalo de nuevo.');
    } finally {
      setCargandoSolicitud(false);
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
            onClick={() => {
              setPestana('misSolicitudes');
              cargarMisSolicitudes();
            }}
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
            <h2 className="text-xl font-bold text-slate-800 mb-6">Encuentra a tu nuevo compañero</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
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
              <div>
                <label htmlFor="ordenar-catalogo" className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Ordenar por
                </label>
                <select
                  id="ordenar-catalogo"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  <option value="">Orden original</option>
                  <option value="nombre-asc">Nombre (A-Z)</option>
                  <option value="edad-asc">Edad: menor a mayor</option>
                  <option value="edad-desc">Edad: mayor a menor</option>
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
            {errorSolicitudes && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {errorSolicitudes}
              </p>
            )}
            {errorCancelacion && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                {errorCancelacion}
              </p>
            )}
            <p className="mb-4 text-sm text-slate-600">
              Las respuestas del refugio se muestran aquí. Abre esta pestaña para actualizar el estado de tus postulaciones.
            </p>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Mascota</th>
                    <th className="px-6 py-4">Mensaje enviado</th>
                    <th className="px-6 py-4">Perfil del hogar</th>
                    <th className="px-6 py-4">Estado de la Postulación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {solicitudesUsuario.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{s.mascotaNombre}</td>
                      <td className="px-6 py-4">{s.mensaje}</td>
                      <td className="px-6 py-4">
                        {s.tipoVivienda && (
                          <span>
                            {s.tipoVivienda === 'CASA' ? 'Casa' : 'Apartamento'} · {s.horasLibres} h/día ·
                            {' '}{s.nivelActividad === 'ALTO' ? 'Activo' : s.nivelActividad === 'MEDIO' ? 'Moderado' : 'Tranquilo'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          s.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                          s.estado === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                          s.estado === 'CANCELADA' ? 'bg-slate-200 text-slate-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {s.estado}
                        </span>
                        {s.estado === 'PENDIENTE' && (
                          <button
                            type="button"
                            onClick={() => cancelarSolicitud(s)}
                            disabled={cancelandoId === s.id}
                            aria-label={`Cancelar solicitud de ${s.mascotaNombre}`}
                            className="ml-3 rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                          >
                            {cancelandoId === s.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                        {s.estado === 'APROBADA' && (
                          <p className="mt-2 max-w-xs rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900" role="status">
                            ¡Buenas noticias! Tu postulación fue aprobada. Comunícate con el refugio para coordinar los siguientes pasos de la adopción.
                          </p>
                        )}
                        {s.estado === 'RECHAZADA' && (
                          <p className="mt-2 max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" role="status">
                            Gracias por tu interés. En esta ocasión no fue posible continuar con esta postulación; puedes seguir buscando y postularte a otras mascotas.
                          </p>
                        )}
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
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-postulacion-titulo"
          >
            <h3 id="modal-postulacion-titulo" className="text-xl font-bold text-slate-900 mb-2">
              Postularse para adoptar a {mascotaSeleccionada?.nombre}
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              Cuéntanos sobre tu hogar y rutina. Esta información ayuda al refugio a conocer tus condiciones; no descarta ni limita tu postulación.
            </p>
            <form onSubmit={enviarSolicitud}>
              <fieldset className="mb-5">
                <legend className="mb-3 text-sm font-bold text-slate-900">Sobre tu hogar y disponibilidad</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="postulacion-vivienda" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Tipo de vivienda
                    </label>
                    <select
                      id="postulacion-vivienda"
                      value={tipoVivienda}
                      onChange={cambiarRespuestaHogar(setTipoVivienda)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="APARTAMENTO">Apartamento</option>
                      <option value="CASA">Casa</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="postulacion-horas" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Horas disponibles al día
                    </label>
                    <input
                      id="postulacion-horas"
                      type="number"
                      min="1"
                      max="12"
                      step="1"
                      value={horasLibres}
                      onChange={cambiarRespuestaHogar(setHorasLibres)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="postulacion-actividad" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Ritmo de vida
                    </label>
                    <select
                      id="postulacion-actividad"
                      value={nivelActividad}
                      onChange={cambiarRespuestaHogar(setNivelActividad)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="BAJO">Tranquilo / relajado</option>
                      <option value="MEDIO">Moderado</option>
                      <option value="ALTO">Muy activo / deportivo</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <div className="mb-4">
                <label htmlFor="postulacion-mensaje" className="mb-1.5 block text-sm font-bold text-slate-900">
                  ¿Por qué quieres adoptar y cómo cuidarás a {mascotaSeleccionada?.nombre}?
                </label>
                <p className="mb-2 text-xs text-slate-600">
                  Puedes contarnos quiénes vivirán con la mascota, cómo organizarás sus cuidados y qué esperas de la adaptación.
                </p>
                <textarea
                  id="postulacion-mensaje"
                  rows="5"
                  maxLength="2000"
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  placeholder="Describe tu hogar, las personas que convivirán con la mascota y el tiempo que dedicarás a sus cuidados."
                  value={mensajeMotivacion}
                  onChange={(e) => setMensajeMotivacion(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Afinidad estimada</h4>
                    <p className="text-xs text-emerald-900">
                      Opcional: compara tus respuestas con las necesidades generales de esta mascota.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={calcularAfinidad}
                    disabled={cargandoAfinidad || cargandoSolicitud}
                    className="rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                  >
                    {cargandoAfinidad ? 'Calculando...' : 'Calcular afinidad'}
                  </button>
                </div>
                {afinidad && (
                  <div className="mt-3 border-t border-emerald-200 pt-3" role="status">
                    <p className="text-sm font-bold text-emerald-950">
                      {afinidad.porcentajeCompatibilidad}% de afinidad estimada
                    </p>
                    <p className="mt-1 text-sm text-emerald-900">{afinidad.justificacion}</p>
                  </div>
                )}
              </div>

              {errorFormulario && (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {errorFormulario}
                </p>
              )}
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={cargandoSolicitud || cargandoAfinidad}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60">
                  {cargandoSolicitud ? 'Enviando...' : 'Enviar Postulación'}
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