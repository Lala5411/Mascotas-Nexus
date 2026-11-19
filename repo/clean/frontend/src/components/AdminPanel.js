import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [mascotas, setMascotas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  
  // Estados para la nueva mascota
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [edad, setEdad] = useState('');
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);

  const nombreUsuario = localStorage.getItem('nombre');

  useEffect(() => {
    cargarMascotas();
    cargarSolicitudes();
  }, []);

  const cargarMascotas = async () => {
    const res = await axios.get('http://localhost:8080/api/mascotas');
    setMascotas(res.data);
  };

  const cargarSolicitudes = async () => {
    const res = await axios.get('http://localhost:8080/api/solicitudes');
    setSolicitudes(res.data);
  };

  const agregarMascota = async (e) => {
    e.preventDefault();
    let urlFinal = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'; // Imagen por defecto

    // Si seleccionó un archivo local, lo subimos primero al servidor
    if (archivoImagen) {
      setCargandoImagen(true);
      const formData = new FormData();
      formData.append('file', archivoImagen);

      try {
        const uploadRes = await axios.post('http://localhost:8080/api/archivos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        urlFinal = uploadRes.data.url;
      } catch (error) {
        alert("Error al subir la imagen.");
        setCargandoImagen(false);
        return;
      }
      setCargandoImagen(false);
    }

    // Guardar la mascota con la URL generada por el backend
    await axios.post('http://localhost:8080/api/mascotas', {
      nombre,
      especie,
      edad: parseInt(edad),
      estado: 'DISPONIBLE',
      imagenUrl: urlFinal
    });

    setNombre('');
    setEdad('');
    setArchivoImagen(null);
    cargarMascotas();
  };

  const eliminarMascota = async (id) => {
    await axios.delete(`http://localhost:8080/api/mascotas/${id}`);
    cargarMascotas();
  };

  const responderSolicitud = async (id, nuevoEstado) => {
    await axios.put(`http://localhost:8080/api/solicitudes/${id}/estado?estado=${nuevoEstado}`);
    cargarSolicitudes();
    cargarMascotas();
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-2xl font-bold text-slate-800">
              Panel de Administración - Mascota Nexus
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-slate-600">
              Admin: <strong className="text-slate-900">{nombreUsuario}</strong>
            </span>
            <button 
              onClick={cerrarSesion} 
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm rounded-lg transition">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Formulario Agregar Mascota */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Agregar Nueva Mascota</h3>
          <form onSubmit={agregarMascota} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            <input 
              type="text" 
              placeholder="Nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              className="border border-slate-300 rounded-xl p-2.5 text-sm"
            />
            <select 
              value={especie} 
              onChange={(e) => setEspecie(e.target.value)} 
              className="border border-slate-300 rounded-xl p-2.5 text-sm">
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Otro">Otro</option>
            </select>
            <input 
              type="number" 
              placeholder="Edad" 
              value={edad} 
              onChange={(e) => setEdad(e.target.value)} 
              required 
              className="border border-slate-300 rounded-xl p-2.5 text-sm"
            />
            {/* Input para seleccionar archivo desde el ordenador */}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setArchivoImagen(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <button 
              type="submit" 
              disabled={cargandoImagen}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm py-2.5 transition">
              {cargandoImagen ? 'Subiendo...' : 'Guardar Mascota'}
            </button>
          </form>
        </section>

        {/* Bandeja de Solicitudes */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">📩 Solicitudes de Adopción Recibidas</h3>
          {solicitudes.length === 0 ? <p className="text-sm text-slate-500">No hay solicitudes registradas.</p> : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mascota</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Mensaje</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {solicitudes.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{s.mascota?.nombre}</td>
                    <td className="px-4 py-3">{s.usuario?.nombre || 'Usuario'}</td>
                    <td className="px-4 py-3">{s.mensaje}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        s.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                        s.estado === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {s.estado === 'PENDIENTE' && (
                        <>
                          <button onClick={() => responderSolicitud(s.id, 'APROBADA')} className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700">Aprobar</button>
                          <button onClick={() => responderSolicitud(s.id, 'RECHAZADA')} className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700">Rechazar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Inventario de Mascotas */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">📋 Inventario General</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mascotas.map((m) => (
              <div key={m.id} className="border border-slate-200 rounded-xl p-4 flex items-center space-x-4">
                <img src={m.imagenUrl} alt={m.nombre} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{m.nombre}</p>
                  <p className="text-xs text-slate-500">{m.especie} • {m.edad} años</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    m.estado === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {m.estado}
                  </span>
                </div>
                <button onClick={() => eliminarMascota(m.id)} className="text-xs font-semibold text-red-600 hover:text-red-800">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;