import React, { useState } from "react";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { HiOutlineSearchCircle, HiOutlineClipboardList } from "react-icons/hi";
import { obtenerAuditoria } from "../../services/auditoria";

const hoy = new Date().toISOString().slice(0, 10);
const hace30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
const entidades = ["", "ventas", "productos", "usuarios", "caja"];
const accionColors = {
  CREAR: { bg: "var(--color-success-bg)", color: "var(--color-success)" },
  MODIFICAR: { bg: "var(--color-warning-bg)", color: "var(--color-warning)" },
  ELIMINAR: { bg: "var(--color-error-bg)", color: "var(--color-error)" },
};

export default function Auditoria() {
  const [entidad, setEntidad] = useState("");
  const [desde, setDesde] = useState(hace30);
  const [hasta, setHasta] = useState(hoy);
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(false);

  const consultar = async () => {
    setCargando(true);
    try {
      const res = await obtenerAuditoria(entidad || undefined, desde, hasta);
      if (res.success) setRegistros(res.data);
      else toast.error("Error al consultar.");
    } catch { toast.error("Error al consultar auditoría."); }
    finally { setCargando(false); }
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        {/* Filters */}
        <div className="rounded-2xl p-5 border mb-6 flex flex-wrap items-end gap-4" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Entidad</label>
            <select value={entidad} onChange={(e) => setEntidad(e.target.value)} className="px-3 py-2 rounded-xl text-sm border capitalize" style={{ borderColor: "var(--color-border)" }}>
              {entidades.map((e) => (<option key={e} value={e}>{e || "Todas"}</option>))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="px-3 py-2 rounded-xl text-sm border" style={{ borderColor: "var(--color-border)" }} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="px-3 py-2 rounded-xl text-sm border" style={{ borderColor: "var(--color-border)" }} />
          </div>
          <button onClick={consultar} disabled={cargando} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            <HiOutlineSearchCircle className="w-4 h-4" /> {cargando ? "Buscando..." : "Consultar"}
          </button>
        </div>

        {/* Results */}
        <div className="rounded-2xl overflow-hidden border" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>Descripción</th></tr></thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan={5} className="py-16 text-center"><span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Cargando...</span></td></tr>
                ) : registros.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center">
                    <HiOutlineClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Sin registros de auditoría</p>
                  </td></tr>
                ) : registros.map((r, i) => {
                  const ac = accionColors[r.accion] || { bg: "var(--color-info-bg)", color: "var(--color-info)" };
                  return (
                    <tr key={i}>
                      <td style={{ color: "var(--color-text-secondary)" }}>{new Date(r.fecha).toLocaleString("es-NI", { dateStyle: "short", timeStyle: "short" })}</td>
                      <td>{r.usuarioLogin}</td>
                      <td><span className="badge" style={{ background: ac.bg, color: ac.color }}>{r.accion}</span></td>
                      <td className="capitalize">{r.entidad}</td>
                      <td>{r.descripcion}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
