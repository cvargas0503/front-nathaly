import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineClipboardList, HiOutlineEye } from "react-icons/hi";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { obtenerMovimientosAPI } from "../../services/caja";

export default function MovimientoCaja() {
  const [movimientos, setMovimientos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => { fetchMovimientos(); }, []);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const res = await obtenerMovimientosAPI();
      if (res.success) setMovimientos(res.data);
      else toast.error("Error al cargar los movimientos.");
    } catch { toast.error("Error al cargar los movimientos."); }
    finally { setLoading(false); }
  };

  const filtrar = movimientos.filter((m) =>
    m.movimiento?.toLowerCase().includes(filtro.toLowerCase()) ||
    (m.documento || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (m.cliente || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (m.empleado || "").toLowerCase().includes(filtro.toLowerCase())
  );

  const totalIngC = filtrar.reduce((s, m) => (m.tipo === "Venta" || m.tipo === "Ingreso") ? s + m.pagos.filter((p) => p.moneda === "C$").reduce((a, p) => a + p.monto, 0) : s, 0);
  const totalIngD = filtrar.reduce((s, m) => (m.tipo === "Venta" || m.tipo === "Ingreso") ? s + m.pagos.filter((p) => p.moneda === "$").reduce((a, p) => a + p.monto, 0) : s, 0);
  const totalEgrC = filtrar.reduce((s, m) => m.tipo === "Egreso" ? s + m.pagos.filter((p) => p.moneda === "C$").reduce((a, p) => a + p.monto, 0) : s, 0);
  const totalEgrD = filtrar.reduce((s, m) => m.tipo === "Egreso" ? s + m.pagos.filter((p) => p.moneda === "$").reduce((a, p) => a + p.monto, 0) : s, 0);

  const tipoBadge = (t) => {
    if (t === "Venta") return "badge-success";
    if (t === "Ingreso") return "badge-info";
    if (t === "Egreso") return "badge-error";
    return "badge-warning";
  };

  const calcIngC = (m) => (m.tipo === "Venta" || m.tipo === "Ingreso") ? m.pagos.filter((p) => p.moneda === "C$").reduce((s, p) => s + p.monto, 0) : 0;
  const calcIngD = (m) => (m.tipo === "Venta" || m.tipo === "Ingreso") ? m.pagos.filter((p) => p.moneda === "$").reduce((s, p) => s + p.monto, 0) : 0;
  const calcEgrC = (m) => m.tipo === "Egreso" ? m.pagos.filter((p) => p.moneda === "C$").reduce((s, p) => s + p.monto, 0) : 0;
  const calcEgrD = (m) => m.tipo === "Egreso" ? m.pagos.filter((p) => p.moneda === "$").reduce((s, p) => s + p.monto, 0) : 0;

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Ingresos C$", val: `C$ ${totalIngC.toFixed(2)}`, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
            { label: "Ingresos $", val: `$ ${totalIngD.toFixed(2)}`, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
            { label: "Egresos C$", val: `C$ ${totalEgrC.toFixed(2)}`, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
            { label: "Egresos $", val: `$ ${totalEgrD.toFixed(2)}`, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-4 border" style={{ background: "white", borderColor: "var(--color-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{c.label}</p>
              <p className="text-lg font-bold" style={{ color: c.color }}>{c.val}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
          <input type="text" placeholder="Buscar movimiento, documento, cliente..." value={filtro} onChange={(e) => setFiltro(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl text-sm w-full sm:w-72 focus:outline-none transition-all"
            style={{ border: "1.5px solid var(--color-border)", background: "white" }} />
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Tipo</th><th>N° Mov</th><th>Doc</th><th>Empleado</th><th>Cliente</th><th>Fecha</th><th>Ing C$</th><th>Ing $</th><th>Egr C$</th><th>Egr $</th><th className="text-right">Ver</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11} className="py-16 text-center"><span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Cargando...</span></td></tr>
                ) : filtrar.length === 0 ? (
                  <tr><td colSpan={11} className="py-16 text-center">
                    <HiOutlineClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Sin movimientos.</p>
                  </td></tr>
                ) : filtrar.map((m) => (
                  <tr key={m.id}>
                    <td><span className={`badge ${tipoBadge(m.tipo)}`}>{m.tipo}</span></td>
                    <td>{m.movimiento}</td><td>{m.documento}</td><td>{m.empleado}</td>
                    <td>{m.cliente || "—"}</td><td style={{ color: "var(--color-text-secondary)" }}>{m.fecha}</td>
                    <td>{calcIngC(m).toFixed(2)}</td><td>{calcIngD(m).toFixed(2)}</td>
                    <td>{calcEgrC(m).toFixed(2)}</td><td>{calcEgrD(m).toFixed(2)}</td>
                    <td className="text-right">
                      <button onClick={() => setDetalle(m)} className="p-2 rounded-lg transition-colors" style={{ color: "var(--brand-primary-light)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(42,82,152,0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {filtrar.length > 0 && (
                <tfoot>
                  <tr style={{ background: "var(--color-surface-2)" }}>
                    <td colSpan={6} className="text-right font-semibold">Totales:</td>
                    <td className="font-bold" style={{ color: "#10b981" }}>{totalIngC.toFixed(2)}</td>
                    <td className="font-bold" style={{ color: "#10b981" }}>{totalIngD.toFixed(2)}</td>
                    <td className="font-bold" style={{ color: "#ef4444" }}>{totalEgrC.toFixed(2)}</td>
                    <td className="font-bold" style={{ color: "#ef4444" }}>{totalEgrD.toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr style={{ background: "var(--color-surface-2)" }}>
                    <td colSpan={6} className="text-right font-semibold">Saldo Neto:</td>
                    <td colSpan={2} className="font-bold" style={{ color: "var(--color-success)" }}>C$ {(totalIngC - totalEgrC).toFixed(2)}</td>
                    <td colSpan={2} className="font-bold" style={{ color: "var(--color-success)" }}>$ {(totalIngD - totalEgrD).toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detalle} onOpenChange={() => setDetalle(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Detalle — {detalle?.documento}</DialogTitle></DialogHeader>
          {detalle && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span style={{ color: "var(--color-text-muted)" }}>Tipo:</span> <span className={`badge ${tipoBadge(detalle.tipo)}`}>{detalle.tipo}</span></div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Fecha:</span> {detalle.fecha}</div>
                <div><span style={{ color: "var(--color-text-muted)" }}>Empleado:</span> {detalle.empleado}</div>
                {detalle.cliente && <div><span style={{ color: "var(--color-text-muted)" }}>Cliente:</span> {detalle.cliente}</div>}
              </div>
              {detalle.motivo && <div className="p-3 rounded-xl" style={{ background: "var(--color-surface-2)" }}><span style={{ color: "var(--color-text-muted)" }}>Motivo:</span> {detalle.motivo}</div>}
              {detalle.pagos?.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold">Pagos:</p>
                  {detalle.pagos.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl border-l-4 flex justify-between" style={{ background: "var(--color-surface-2)", borderColor: "var(--brand-primary)" }}>
                      <span className="font-medium">{p.metodo}</span>
                      <span>{p.monto} {p.moneda} {p.referencia ? <span className="text-xs ml-1" style={{ color: "var(--color-text-muted)" }}>Ref: {p.referencia}</span> : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
