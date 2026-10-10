import React, { useState, useEffect } from "react";
import Layout from "../../components/general/layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { HiOutlineRefresh, HiOutlineEye, HiOutlinePlusCircle, HiOutlineSearchCircle } from "react-icons/hi";
import { obtenerDevoluciones, obtenerDevolucion, registrarDevolucion } from "../../services/devoluciones";
import { ObtenerVentas } from "../../services/venta";

const hoy = new Date().toISOString().slice(0, 10);
const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
const fmt = (n) => `C$ ${(n || 0).toFixed(2)}`;

export default function Devoluciones() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde] = useState(inicioMes);
  const [hasta, setHasta] = useState(hoy);
  const [detalle, setDetalle] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [ventaSel, setVentaSel] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [productosDevol, setProductosDevol] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargarDevoluciones(); }, []);

  const cargarDevoluciones = async () => {
    setCargando(true);
    try {
      const res = await obtenerDevoluciones(desde, hasta);
      if (res.success) setDevoluciones(res.data);
    } catch { toast.error("Error al cargar devoluciones."); }
    finally { setCargando(false); }
  };

  const verDetalle = async (id) => {
    try {
      const res = await obtenerDevolucion(id);
      if (res.success) { setDetalle(res.data); setMostrarDetalle(true); }
    } catch { toast.error("Error al cargar detalle."); }
  };

  const abrirNueva = async () => {
    try {
      const res = await ObtenerVentas();
      if (res.success) setVentas(res.data.filter((v) => v.estado?.toUpperCase() === "PAGADA"));
    } catch { /* Optional data is unavailable; retain the current view. */ }
    setMostrarNueva(true);
  };

  const seleccionarVenta = (v) => {
    setVentaSel(v);
    setProductosDevol((v.detalles || []).map((d) => ({
      idProducto: d.idProducto, descripcion: d.descripcion || d.referencia,
      maxCant: d.cantidad, cantidad: 0, precioUnitario: d.precioUnitario,
    })));
  };

  const guardarDevolucion = async () => {
    if (!ventaSel) return toast.error("Seleccione una venta.");
    if (!motivo.trim()) return toast.error("Ingrese un motivo.");
    const items = productosDevol.filter((p) => p.cantidad > 0);
    if (items.length === 0) return toast.error("Indique al menos un producto.");
    setGuardando(true);
    try {
      const res = await registrarDevolucion({
        idVenta: ventaSel.idVenta, motivo: motivo.trim(),
        detalles: items.map((p) => ({ idProducto: p.idProducto, cantidad: p.cantidad })),
      });
      if (res.success) {
        toast.success(`Nota de Crédito ${res.data.numeroNC} creada.`);
        setMostrarNueva(false); setVentaSel(null); setMotivo(""); setProductosDevol([]);
        cargarDevoluciones();
      } else toast.error(res.message || "Error al registrar.");
    } catch (e) { toast.error(e.response?.data?.message || "Error inesperado."); }
    finally { setGuardando(false); }
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Desde</label>
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="px-3 py-2 rounded-xl text-sm border" style={{ borderColor: "var(--color-border)" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Hasta</label>
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="px-3 py-2 rounded-xl text-sm border" style={{ borderColor: "var(--color-border)" }} />
            </div>
            <button onClick={cargarDevoluciones} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <HiOutlineSearchCircle className="w-4 h-4" /> Filtrar
            </button>
          </div>
          <button onClick={abrirNueva} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #1e3a5f, #2a5298)", boxShadow: "0 4px 12px rgba(30,58,95,0.3)" }}>
            <HiOutlinePlusCircle className="w-5 h-5" /> Nueva Devolución
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>N° Nota</th><th>Fecha</th><th>Venta</th><th>Cliente</th><th>Total</th><th>Motivo</th><th className="text-right">Acciones</th></tr></thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan={7} className="py-16 text-center"><span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Cargando...</span></td></tr>
                ) : devoluciones.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <HiOutlineRefresh className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No hay devoluciones.</p>
                  </td></tr>
                ) : devoluciones.map((d) => (
                  <tr key={d.idNotaCredito}>
                    <td><span className="font-semibold" style={{ color: "var(--brand-primary)" }}>{d.numeroNc}</span></td>
                    <td style={{ color: "var(--color-text-secondary)" }}>{d.fecha}</td>
                    <td>{d.numeroVenta}</td><td>{d.cliente}</td>
                    <td><span className="font-semibold">{fmt(d.total)}</span></td>
                    <td className="max-w-[200px] truncate" title={d.motivo}>{d.motivo}</td>
                    <td className="text-right">
                      <button onClick={() => verDetalle(d.idNotaCredito)} className="p-2 rounded-lg transition-colors" style={{ color: "var(--brand-primary-light)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(42,82,152,0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detalle de Devolución</DialogTitle></DialogHeader>
          {detalle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span style={{ color: "var(--color-text-muted)" }}>Nota:</span> <strong>{detalle.numeroNc}</strong></div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Fecha:</span> {detalle.fecha}</div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Venta:</span> {detalle.numeroVenta}</div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Cliente:</span> {detalle.cliente}</div>
              </div>
              <div className="p-3 rounded-xl text-sm" style={{ background: "var(--color-surface-2)" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Motivo:</span> {detalle.motivo}
              </div>
              <table className="data-table"><thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Monto</th></tr></thead>
                <tbody>{detalle.detalles?.map((d, i) => (
                  <tr key={i}><td>{d.producto || d.codigoProducto}</td><td>{d.cantidad}</td><td>{fmt(d.precioUnitario)}</td><td className="font-semibold">{fmt(d.monto)}</td></tr>
                ))}</tbody>
              </table>
              <div className="text-right"><span className="text-lg font-bold" style={{ color: "var(--brand-primary)" }}>Total: {fmt(detalle.total)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Return Modal */}
      <Dialog open={mostrarNueva} onOpenChange={setMostrarNueva}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>Nueva Devolución</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: "var(--color-text-secondary)" }}>Venta</label>
              <select value={ventaSel?.idVenta || ""} onChange={(e) => { const v = ventas.find((x) => x.idVenta === parseInt(e.target.value)); if (v) seleccionarVenta(v); }}
                className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--color-border)" }}>
                <option value="">-- Seleccione --</option>
                {ventas.map((v) => (<option key={v.idVenta} value={v.idVenta}>#{v.numeroVenta} — {v.cliente} — {fmt(v.total)}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: "var(--color-text-secondary)" }}>Motivo</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl text-sm border resize-none" style={{ borderColor: "var(--color-border)" }} placeholder="Ej: Producto defectuoso" />
            </div>
            {productosDevol.length > 0 && (
              <table className="data-table"><thead><tr><th>Producto</th><th>Max</th><th>Devolver</th><th>Subtotal</th></tr></thead>
                <tbody>{productosDevol.map((p, i) => (
                  <tr key={i}><td>{p.descripcion}</td><td>{p.maxCant}</td>
                    <td><input type="number" min={0} max={p.maxCant} value={p.cantidad} onChange={(e) => { const n=[...productosDevol]; n[i].cantidad=Math.min(Math.max(0,parseInt(e.target.value)||0),p.maxCant); setProductosDevol(n); }} className="w-20 px-2 py-1 rounded-lg text-sm border text-center" style={{ borderColor: "var(--color-border)" }} /></td>
                    <td className="font-semibold">{fmt(p.cantidad * p.precioUnitario)}</td>
                  </tr>))}</tbody>
              </table>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setMostrarNueva(false)} className="px-5 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>Cancelar</button>
              <button onClick={guardarDevolucion} disabled={guardando} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                {guardando ? "Guardando..." : "Registrar Devolución"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
