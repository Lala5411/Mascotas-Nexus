import React, { useState } from 'react';
import axios from 'axios';

function MatchMascotas() {
  const [tipoVivienda, setTipoVivienda] = useState('APARTAMENTO');
  const [horasLibres, setHorasLibres] = useState(2);
  const [nivelActividad, setNivelActividad] = useState('MEDIO');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const calcularMatch = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await axios.post('http://localhost:8080/api/match', {
        tipoVivienda,
        horasLibres: parseInt(horasLibres),
        tieneNinos: true,
        nivelActividad
      });
      setResultados(res.data);
    } catch (err) {
      alert("Error al calcular la compatibilidad.");
    }
    setCargando(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">🤖</span>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Asistente de Match Inteligente</h2>
          <p className="text-xs text-slate-500">Analizamos las mascotas disponibles según tu estilo de vida</p>
        </div>
      </div>

      <form onSubmit={calcularMatch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Vivienda</label>
          <select 
            value={tipoVivienda} 
            onChange={(e) => setTipoVivienda(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2 text-sm">
            <option value="APARTAMENTO">Apartamento</option>
            <option value="CASA">Casa con patio</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Horas libres/día</label>
          <input 
            type="number" 
            value={horasLibres} 
            onChange={(e) => setHorasLibres(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2 text-sm" 
            min="1" max="12"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Ritmo de Vida</label>
          <select 
            value={nivelActividad} 
            onChange={(e) => setNivelActividad(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2 text-sm">
            <option value="BAJO">Tranquilo / Relajado</option>
            <option value="MEDIO">Moderado</option>
            <option value="ALTO">Muy Activo / Deportivo</option>
          </select>
        </div>

        <div className="flex items-end">
          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition">
            {cargando ? 'Analizando...' : '✨ Encontrar Mi Match'}
          </button>
        </div>
      </form>

      {/* Resultados del Algoritmo */}
      {resultados.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Mascotas recomendadas para ti:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resultados.map((item, idx) => (
              <div key={item.mascota.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden bg-slate-50">
                {idx === 0 && (
                  <span className="absolute top-0 right-0 bg-amber-400 text-slate-900 font-extrabold text-[10px] px-3 py-0.5 rounded-bl-lg uppercase">
                    ⭐ Mejor Opción
                  </span>
                )}
                <div className="flex items-center space-x-3 mb-2">
                  <img src={item.mascota.imagenUrl} alt={item.mascota.nombre} className="w-14 h-14 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.mascota.nombre}</h4>
                    <span className="text-emerald-700 text-xs font-bold">{item.porcentajeCompatibilidad}% de Match</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic mt-1">{item.justificacion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchMascotas;