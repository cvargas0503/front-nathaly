import { useState } from "react";
import { HiOutlineCash, HiOutlineTrash, HiOutlineCheck } from "react-icons/hi";
import Layout from "../../components/general/layout";
import { registrarMovimientoAPI } from "../../services/caja";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";

export default function RegistroCaja() {
  const { usuario } = useAuth();
  const [tipo, setTipo] = useState("Ingreso");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [metodo, setMetodo] = useState("");
  const [moneda, setMoneda] = useState("");
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const limpiar = () => {
    setTipo("Ingreso"); setFecha(new Date().toISOString().slice(0, 10));
    setMetodo(""); setMoneda(""); setMonto(""); setReferencia(""); setMotivo("");
  };

  const seleccionarMetodo = (m) => {
    setMetodo(m);
    setMoneda(m.includes("$") ? "$" : "C$");
    if (!m.includes("Transferencia")) setReferencia("");
  };

  const guardar = async () => {
    if (!fecha) return toast.error("La fecha es obligatoria.");
    if (!motivo.trim()) return toast.error("El concepto es obligatorio.");
    if (!monto || parseFloat(monto) <= 0) return toast.error("Monto debe ser mayor a 0.");
    if (tipo === "Ingreso" && !metodo) return toast.error("Selecciona método de pago.");
    if (tipo === "Ingreso" && metodo.includes("Transferencia") && !referencia.trim()) return toast.error("La referencia es obligatoria.");
    if (tipo === "Egreso" && !moneda) return toast.error("Selecciona la moneda.");

    setLoading(true);
    try {
      const data = {
        ingreso: tipo === "Ingreso", fecha,
        formaPago: {
          moneda: metodo.includes("$") ? "USD" : "NIO",
          referencia: referencia.trim() || null,
          monto: parseFloat(monto),
          idFormaPago: metodo.includes("Efectivo") ? 1 : metodo.includes("BAC") ? 2 : metodo.includes("BANPRO") ? 3 : 4,
        },
        concepto: motivo.trim(),
        idEmpleado: 7,
      };
      const res = await registrarMovimientoAPI(data);
      if (res.success) { toast.success(`${tipo} registrado correctamente.`); limpiar(); }
      else toast.error(res.message || "Error al registrar.");
    } catch (e) { toast.error(e.response?.data?.message || "Error inesperado."); }
    finally { setLoading(false); }
  };

  const inputStyle = { borderColor: "var(--color-border)", background: "white" };

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.1)" }}>
                <HiOutlineCash className="w-5 h-5" style={{ color: "#f59e0b" }} />
              </div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Registrar {tipo}</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Tipo</label>
                  <select value={tipo} onChange={(e) => { setTipo(e.target.value); setMetodo(""); setMoneda(""); setReferencia(""); }}
                    className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle}>{["Ingreso", "Egreso"].map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Fecha</label>
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Empleado</label>
                <input value={usuario?.login || "Usuario"} disabled className="px-3 py-2.5 rounded-xl text-sm border" style={{ ...inputStyle, background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }} />
              </div>

              {tipo === "Ingreso" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Método de Pago</label>
                    <select value={metodo} onChange={(e) => seleccionarMetodo(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle}>
                      <option value="">Seleccione...</option>
                      {["Efectivo C$", "Efectivo $", "Transferencia BAC C$", "Transferencia BAC $", "Transferencia BANPRO C$", "Transferencia BANPRO $"].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  {metodo.includes("Transferencia") && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>N° Referencia</label>
                      <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Ej: 123456" className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle} />
                    </div>
                  )}
                </>
              )}

              {tipo === "Egreso" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Moneda</label>
                  <select value={moneda} onChange={(e) => setMoneda(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle}>
                    <option value="">Seleccione...</option><option>C$</option><option>$</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Monto</label>
                <input type="number" min="0" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Concepto *</label>
                <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Descripción del movimiento" className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={limpiar} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                  <HiOutlineTrash className="w-4 h-4" /> Limpiar
                </button>
                <button onClick={guardar} disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #1e3a5f, #2a5298)" }}>
                  <HiOutlineCheck className="w-4 h-4" /> {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
