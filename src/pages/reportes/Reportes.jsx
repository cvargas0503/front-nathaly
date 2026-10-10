import React, { useState, useEffect } from "react";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import {
  obtenerReporteVentas,
  exportarReporteVentas,
  obtenerReporteCompras,
  obtenerInventarioValorizado,
  obtenerCierreDiario,
} from "../../services/reportes";
import { obtenerDatosFormularioFactura } from "../../services/datos";

const tabs = [
  { key: "ventas", label: "Ventas" },
  { key: "compras", label: "Compras" },
  { key: "inventario", label: "Inventario" },
  { key: "caja", label: "Cierre Caja" },
];

const hoy = new Date().toISOString().slice(0, 10);
const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

export default function Reportes() {
  const [tab, setTab] = useState("ventas");
  const [desde, setDesde] = useState(inicioMes);
  const [hasta, setHasta] = useState(hoy);
  const [idSucursal, setIdSucursal] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerDatosFormularioFactura().then((r) => {
      if (r.success) setSucursales(r.data.sucursales || []);
    }).catch(() => {});
  }, []);

  const consultar = async () => {
    setCargando(true);
    setData(null);
    try {
      let res;
      if (tab === "ventas") res = await obtenerReporteVentas(desde, hasta, idSucursal || undefined);
      else if (tab === "compras") res = await obtenerReporteCompras(desde, hasta);
      else if (tab === "inventario") res = await obtenerInventarioValorizado();
      else if (tab === "caja") res = await obtenerCierreDiario(desde, idSucursal || undefined);
      if (res?.success) setData(res.data);
      else toast.error("No se pudo obtener el reporte.");
    } catch {
      toast.error("Error al consultar el reporte.");
    } finally {
      setCargando(false);
    }
  };

  const exportarPDF = async () => {
    try {
      toast.info("Generando PDF...");
      const blob = await exportarReporteVentas(desde, hasta, "pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_ventas_${desde}_${hasta}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Error al exportar.");
    }
  };

  const fmt = (n) => `C$ ${(n || 0).toLocaleString("es-NI", { minimumFractionDigits: 2 })}`;

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setData(null); }}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t.key ? "var(--brand-primary)" : "white",
                color: tab === t.key ? "white" : "var(--color-text-secondary)",
                border: `1.5px solid ${tab === t.key ? "var(--brand-primary)" : "var(--color-border)"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div
          className="rounded-2xl p-5 border mb-6 flex flex-wrap items-end gap-4"
          style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}
        >
          {tab !== "inventario" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Desde</label>
                <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm border focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }} />
              </div>
              {tab !== "caja" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Hasta</label>
                  <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm border focus:outline-none"
                    style={{ borderColor: "var(--color-border)" }} />
                </div>
              )}
            </>
          )}
          {(tab === "ventas" || tab === "caja") && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Sucursal</label>
              <select value={idSucursal} onChange={(e) => setIdSucursal(e.target.value)}
                className="px-3 py-2 rounded-xl text-sm border focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}>
                <option value="">Todas</option>
                {sucursales.map((s) => (
                  <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>
                ))}
              </select>
            </div>
          )}
          <button onClick={consultar} disabled={cargando}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            <HiOutlineSearchCircle className="w-4 h-4" /> {cargando ? "Consultando..." : "Consultar"}
          </button>
          {tab === "ventas" && data && (
            <button onClick={exportarPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <HiOutlineDownload className="w-4 h-4" /> Exportar PDF
            </button>
          )}
        </div>

        {/* Results */}
        {data && (
          <div className="rounded-2xl border overflow-hidden" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
            {/* Summary Cards */}
            {data.resumen && (
              <div className="p-5 border-b flex flex-wrap gap-6" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
                {Object.entries(data.resumen).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {typeof v === "number" ? (k.includes("otal") && !k.includes("Factura") && !k.includes("Compra") ? fmt(v) : v.toLocaleString()) : v}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Detail Table */}
            {data.detalle?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(data.detalle[0]).filter(k => !k.startsWith("id")).map((k) => (
                        <th key={k}>{k.replace(/([A-Z])/g, " $1").trim()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.detalle.map((row, i) => (
                      <tr key={i}>
                        {Object.entries(row).filter(([k]) => !k.startsWith("id")).map(([k, v], j) => (
                          <td key={j}>
                            {typeof v === "number" && (k.includes("total") || k.includes("subtotal") || k.includes("descuento") || k.includes("costo") || k.includes("valor") || k.includes("monto"))
                              ? fmt(v)
                              : v ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Caja special */}
            {tab === "caja" && data.movimientos && (
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Ingresos C$", val: fmt(data.movimientos.ingresoNio), color: "#10b981" },
                  { label: "Ingresos $", val: `$ ${data.movimientos.ingresoUsd?.toFixed(2)}`, color: "#10b981" },
                  { label: "Egresos C$", val: fmt(data.movimientos.egresoNio), color: "#ef4444" },
                  { label: "Egresos $", val: `$ ${data.movimientos.egresoUsd?.toFixed(2)}`, color: "#ef4444" },
                  { label: "Total Movimientos", val: data.movimientos.totalMovimientos, color: "#6366f1" },
                  { label: "Ventas del día", val: `${data.ventas?.totalVentas || 0} — ${fmt(data.ventas?.montoVentas)}`, color: "#f59e0b" },
                ].map((c, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: "var(--color-surface-2)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{c.label}</p>
                    <p className="text-lg font-bold" style={{ color: c.color }}>{c.val}</p>
                  </div>
                ))}
              </div>
            )}

            {data.totalValorizado != null && (
              <div className="p-5 border-t text-right" style={{ borderColor: "var(--color-border)" }}>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Total Valorizado: </span>
                <span className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>{fmt(data.totalValorizado)}</span>
              </div>
            )}
          </div>
        )}

        {!data && !cargando && (
          <div className="rounded-2xl border p-12 flex flex-col items-center" style={{ background: "white", borderColor: "var(--color-border)" }}>
            <HiOutlineDocumentText className="w-12 h-12 mb-3 opacity-30" style={{ color: "var(--color-text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Selecciona filtros y presiona Consultar</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
