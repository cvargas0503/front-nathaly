import React, { useEffect, useState } from "react";
import { HiOutlinePrinter, HiOutlineCalendar, HiOutlineUser, HiOutlineLocationMarker, HiOutlineSave, HiOutlineXCircle, HiOutlineChevronDown } from "react-icons/hi";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { obtenerDatosArqueoIni, cargarArqueoAPI, guardarArqueoAPI, obtenerPDFArqueo, cerrarArqueoAPI } from "../../services/arqueo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function DenominationInput({ title, values, setValues, color }) {
  return (
    <div className="rounded-xl border p-4 flex-1" style={{ background: "white", borderColor: "var(--color-border)" }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color }}>{title}</h3>
      <div className="grid grid-cols-3 gap-2 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
        <div>Denom.</div><div>Cant.</div><div className="text-right">Total</div>
        {values.map((d) => (
          <React.Fragment key={d.idDenominacion}>
            <div className="py-1 text-sm" style={{ color: "var(--color-text-primary)" }}>{d.valor}</div>
            <input type="number" min={0} value={d.cantidad || 0}
              onChange={(e) => { const n = [...values]; const i = n.findIndex((x) => x.idDenominacion === d.idDenominacion); if (i >= 0) n[i].cantidad = parseFloat(e.target.value) || 0; setValues(n); }}
              className="px-2 py-1 rounded-lg text-sm border text-center w-full" style={{ borderColor: "var(--color-border)" }} />
            <div className="py-1 text-right text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>{(d.valor * (d.cantidad || 0)).toFixed(2)}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function ArqueoCaja() {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [empleado, setEmpleado] = useState(0);
  const [sucursal, setSucursal] = useState({ idSucursal: 0, nombre: "Seleccione una sucursal" });
  const [empleados, setEmpleados] = useState([]);
  const [arqueoAbierto, setArqueoAbierto] = useState(false);
  const [, setLoading] = useState(true);
  const [cerrarHabilitado, setCerrarHabilitado] = useState(false);
  const [idArqueo, setIdArqueo] = useState(0);
  const [cordobaIni, setCordobaIni] = useState([]);
  const [dollarIni, setDollarIni] = useState([]);
  const [cordobaFin, setCordobaFin] = useState([]);
  const [dollarFin, setDollarFin] = useState([]);
  const [resumenCierre, setResumenCierre] = useState(null);

  useEffect(() => { fetchDatos(); }, []);

  const fetchDatos = async () => {
    try {
      const res = await obtenerDatosArqueoIni();
      if (res.success) setEmpleados(res.data.empleados);
      else toast.error("Error al cargar datos iniciales.");
    } catch { toast.error("Error al cargar datos."); }
    finally { setLoading(false); }
  };

  const totalCordobaIni = cordobaIni.reduce((a, d) => a + d.valor * (d.cantidad || 0), 0);
  const totalDollarIni = dollarIni.reduce((a, d) => a + d.valor * (d.cantidad || 0), 0);
  const totalCordobaFin = cordobaFin.reduce((a, d) => a + d.valor * (d.cantidad || 0), 0);
  const totalDollarFin = dollarFin.reduce((a, d) => a + d.valor * (d.cantidad || 0), 0);

  const cargarArqueo = async () => {
    try {
      const res = await cargarArqueoAPI(fecha, empleado, sucursal.idSucursal);
      if (!res.success) { toast.error("No se pudo cargar el arqueo."); return; }
      setCordobaIni(res.data.saldoInicialCordoba); setDollarIni(res.data.saldoInicialDolar);
      setCordobaFin(res.data.saldoFinalCordoba); setDollarFin(res.data.saldoFinalDolar);
      setIdArqueo(res.data.idArqueo); setArqueoAbierto(true);
      if (!res.abierto) { toast.info("No hay arqueo abierto para esta fecha."); setCerrarHabilitado(false); return; }
      toast.success("Arqueo cargado."); setCerrarHabilitado(true);
    } catch { toast.error("Error al cargar el arqueo."); }
  };

  const handleSelectEmpleado = (id) => {
    const emp = empleados.find((e) => e.idEmpleado === parseInt(id));
    if (emp) { setEmpleado(emp.idEmpleado); setSucursal({ idSucursal: emp.idSucursal, nombre: emp.sucursal }); }
    else { setEmpleado(0); setSucursal({ idSucursal: 0, nombre: "Seleccione" }); }
  };

  const handleGuardarArqueo = async () => {
    if (!arqueoAbierto) return toast.error("Cargue un arqueo primero.");
    setLoading(true);
    try {
      const res = await guardarArqueoAPI({ fecha, idEmpleado: empleado, idSucursal: sucursal.idSucursal, saldoInicialCordoba: cordobaIni, saldoInicialDolar: dollarIni, saldoFinalCordoba: cordobaFin, saldoFinalDolar: dollarFin });
      if (res.success) toast.success("Arqueo guardado.");
      else toast.error("Error al guardar.");
    } catch { toast.error("Error al guardar."); }
    finally { setLoading(false); }
  };

  const cerrarArqueo = async () => {
    if (!idArqueo) return toast.error("No hay arqueo para cerrar.");
    setLoading(true);
    try {
      const res = await cerrarArqueoAPI(idArqueo);
      if (res.success) {
        toast.success(res.message || "Arqueo cerrado.");
        setResumenCierre(res.data.resumen);
        setCerrarHabilitado(false);
      } else toast.error("Error al cerrar.");
    } catch (e) { toast.error(e.response?.data?.message || "Error al cerrar."); }
    finally { setLoading(false); }
  };

  const imprimirArqueo = async () => {
    if (!idArqueo) return toast.error("No hay arqueo para imprimir.");
    try {
      const html = await obtenerPDFArqueo(idArqueo);
      const blob = new Blob([html], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, { position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0" });
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 1000); };
    } catch { toast.error("Error al imprimir."); }
  };

  const inputStyle = { borderColor: "var(--color-border)", background: "white" };

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">
        <div className="max-w-5xl mx-auto rounded-2xl border p-6" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)" }}>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}><HiOutlineCalendar className="w-3.5 h-3.5" /> Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}><HiOutlineUser className="w-3.5 h-3.5" /> Empleado</label>
              <select value={empleado} onChange={(e) => handleSelectEmpleado(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border" style={inputStyle}>
                <option value={0}>Seleccione</option>
                {empleados.map((e) => (<option key={e.idEmpleado} value={e.idEmpleado}>{e.nombreCompleto}</option>))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}><HiOutlineLocationMarker className="w-3.5 h-3.5" /> Sucursal</label>
              <input value={sucursal.nombre} disabled className="px-3 py-2.5 rounded-xl text-sm border" style={{ ...inputStyle, background: "var(--color-surface-2)" }} />
            </div>
          </div>

          <button onClick={cargarArqueo} disabled={!fecha || !empleado}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            <HiOutlineChevronDown className="w-4 h-4" /> Cargar Arqueo
          </button>

          {arqueoAbierto && (
            <div className="mt-6 space-y-6">
              {/* Initial Balances */}
              <div>
                <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Saldos Iniciales</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <DenominationInput title="Córdobas (C$)" values={cordobaIni} setValues={setCordobaIni} color="#6366f1" />
                  <DenominationInput title="Dólares ($)" values={dollarIni} setValues={setDollarIni} color="#f59e0b" />
                </div>
              </div>

              {/* Final Balances */}
              <div>
                <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Saldos Finales</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <DenominationInput title="Córdobas (C$)" values={cordobaFin} setValues={setCordobaFin} color="#6366f1" />
                  <DenominationInput title="Dólares ($)" values={dollarFin} setValues={setDollarFin} color="#f59e0b" />
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ background: "var(--color-surface-2)" }}>
                {[
                  { label: "Inicial C$", val: `C$ ${totalCordobaIni.toFixed(2)}`, color: "#6366f1" },
                  { label: "Inicial $", val: `$ ${totalDollarIni.toFixed(2)}`, color: "#f59e0b" },
                  { label: "Final C$", val: `C$ ${totalCordobaFin.toFixed(2)}`, color: "#6366f1" },
                  { label: "Final $", val: `$ ${totalDollarFin.toFixed(2)}`, color: "#f59e0b" },
                ].map((c, i) => (
                  <div key={i}><p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>{c.label}</p><p className="text-lg font-bold" style={{ color: c.color }}>{c.val}</p></div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleGuardarArqueo} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                  <HiOutlineSave className="w-4 h-4" /> Guardar
                </button>
                {cerrarHabilitado && (
                  <button onClick={cerrarArqueo} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
                    <HiOutlineXCircle className="w-4 h-4" /> Cerrar Arqueo
                  </button>
                )}
                <button onClick={imprimirArqueo} disabled={!idArqueo} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border disabled:opacity-40" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                  <HiOutlinePrinter className="w-4 h-4" /> Imprimir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Summary */}
      <Dialog open={!!resumenCierre} onOpenChange={() => setResumenCierre(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Resumen de Cierre</DialogTitle></DialogHeader>
          {resumenCierre && (
            <div className="space-y-3 text-sm">
              {Object.entries(resumenCierre).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: "var(--color-border)" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>{k.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="font-semibold">{typeof v === "number" ? v.toFixed(2) : v}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
