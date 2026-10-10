import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IoSearchOutline, IoCashOutline } from "react-icons/io5";
import { HiOutlineCash, HiOutlineDocumentText } from "react-icons/hi";
import Layout from "../../components/general/layout";
import { ObtenerVentasPendientes } from "../../services/venta";
import { obtenerTasaCambio } from "../../services/configuracion";
import { toast } from "react-toastify";
import { confirmarPagoApi } from "../../services/caja";

export default function PagoVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [contexto, setContexto] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [tasaCambio, setTasaCambio] = useState(37);

  useEffect(() => {
    cargarVentas();
    cargarTasa();
  }, []);

  const cargarVentas = async () => {
    try {
      setCargando(true);
      const res = await ObtenerVentasPendientes();
      if (res.success) setVentas(res.data);
      else toast.error("Error al cargar ventas pendientes.");
    } catch { toast.error("Error al cargar ventas."); }
    finally { setCargando(false); }
  };

  const cargarTasa = async () => {
    try {
      const res = await obtenerTasaCambio();
      if (res.success) setTasaCambio(res.data.valor);
    } catch { /* Optional data is unavailable; retain the current view. */ }
  };

  const abrirPago = (venta) => { setContexto(venta); setPagos([]); };
  const cerrarModal = () => { setContexto(null); setPagos([]); };

  const agregarMetodo = (metodo, id, requiereRef = false) => {
    if (requiereRef) {
      const ref = prompt("Ingrese el número de referencia:");
      if (!ref) return;
      setPagos((prev) => [...prev, { metodo, idFormaPago: id, monto: "", referencia: ref, moneda: "NIO" }]);
    } else {
      setPagos((prev) => [...prev, { metodo, idFormaPago: id, monto: "", referencia: "", moneda: "USD" }]);
    }
  };

  const totalPagadoCordoba = pagos.reduce((s, p) => s + (p.moneda === "NIO" ? parseFloat(p.monto || 0) : 0), 0);
  const totalPagadoDolar = pagos.reduce((s, p) => s + (p.moneda === "USD" ? parseFloat(p.monto || 0) : 0), 0);
  const totalConvertido = totalPagadoCordoba + totalPagadoDolar * tasaCambio;

  const confirmarPagos = async () => {
    if (totalConvertido < contexto.monto) return toast.error("Monto insuficiente.");
    try {
      const res = await confirmarPagoApi(contexto.id, { formasPago: pagos });
      if (res.success) {
        toast.success("Pago registrado exitosamente.");
        setVentas(ventas.filter((v) => v.id !== contexto.id));
        cerrarModal();
      } else toast.error(res.message || "Error al registrar.");
    } catch (e) { toast.error(e.response?.data?.message || "Error inesperado."); }
  };

  const cambio = contexto ? Math.max(0, totalConvertido - contexto.monto) : 0;

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
              <HiOutlineCash className="w-5 h-5" style={{ color: "#6366f1" }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Tasa de cambio: <strong>C$ {tasaCambio}</strong></p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>N° Venta</th><th>Cliente</th><th>Empleado</th><th>Sucursal</th><th>Fecha</th><th>Monto</th><th>Estado</th><th className="text-right">Acción</th></tr></thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan={8} className="py-16 text-center">
                    <svg className="animate-spin w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-primary)" }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  </td></tr>
                ) : ventas.length === 0 ? (
                  <tr><td colSpan={8} className="py-16 text-center">
                    <HiOutlineDocumentText className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No hay ventas pendientes de pago.</p>
                  </td></tr>
                ) : ventas.map((v) => (
                  <tr key={v.id}>
                    <td><span className="font-semibold" style={{ color: "var(--brand-primary)" }}>#{v.numero}</span></td>
                    <td>{v.cliente}</td><td>{v.empleado}</td><td>{v.sucursal}</td>
                    <td style={{ color: "var(--color-text-secondary)" }}>{v.fecha}</td>
                    <td><span className="font-semibold">C$ {v.monto?.toFixed(2)}</span></td>
                    <td><span className="badge badge-warning">{v.estado}</span></td>
                    <td className="text-right">
                      <button onClick={() => abrirPago(v)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                        style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                        Pagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={!!contexto} onOpenChange={cerrarModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Pago — Venta #{contexto?.numero}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl text-center" style={{ background: "var(--color-surface-2)" }}>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Total a pagar</p>
              <p className="text-2xl font-bold" style={{ color: "var(--brand-primary)" }}>C$ {contexto?.monto?.toFixed(2)}</p>
            </div>

            {pagos.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                <span className="text-sm font-medium flex-1">{p.metodo}</span>
                <input type="number" placeholder="Monto" value={p.monto}
                  onChange={(e) => { const n = [...pagos]; n[idx].monto = e.target.value; setPagos(n); }}
                  className="w-24 px-2 py-1.5 rounded-lg text-sm border text-center" style={{ borderColor: "var(--color-border)" }} />
                <select value={p.moneda} onChange={(e) => { const n = [...pagos]; n[idx].moneda = e.target.value; setPagos(n); }}
                  className="px-2 py-1.5 rounded-lg text-sm border" style={{ borderColor: "var(--color-border)" }}>
                  <option value="USD">$</option><option value="NIO">C$</option>
                </select>
                <button onClick={() => setPagos(pagos.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 text-lg">×</button>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <button onClick={() => agregarMetodo("Efectivo", 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>+ Efectivo</button>
              <button onClick={() => agregarMetodo("Trans. BAC", 2, true)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>+ BAC</button>
              <button onClick={() => agregarMetodo("Trans. BANPRO", 3, true)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>+ BANPRO</button>
              <button onClick={() => agregarMetodo("Trans. LAFISE", 4, true)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>+ LAFISE</button>
            </div>

            <div className="p-3 rounded-xl text-sm space-y-1" style={{ background: "var(--color-surface-2)" }}>
              <div className="flex justify-between"><span style={{ color: "var(--color-text-muted)" }}>Pagado C$:</span><span>{totalPagadoCordoba.toFixed(2)}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--color-text-muted)" }}>Pagado $:</span><span>{totalPagadoDolar.toFixed(2)}</span></div>
              {cambio > 0 && <div className="flex justify-between font-semibold" style={{ color: "var(--color-success)" }}><span>Vuelto:</span><span>C$ {cambio.toFixed(2)}</span></div>}
            </div>

            <button onClick={confirmarPagos} disabled={totalConvertido < (contexto?.monto || 0)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: totalConvertido >= (contexto?.monto || 0) ? "linear-gradient(135deg, #059669, #047857)" : "#d1d5db" }}>
              Confirmar Pago
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
