import { useState, useEffect } from "react";
import { BadgeDollarSign, Search } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { obtenerMovimientosAPI } from "../../services/caja";

export default function MovimientoCaja() {
  const [movimientos, setMovimientos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovimientos();
  }, []);

  

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const respuesta = await obtenerMovimientosAPI();
      if (!respuesta.success) {
        toast.error(respuesta.message || "Error al cargar los movimientos");
        return;
      }
      setMovimientos(respuesta.data);

    }catch (error) {
      console.error("Error al cargar los movimientos:", error);
      toast.error("Error al cargar los movimientos. Por favor, intente nuevamente.");
    }finally{
      setLoading(false);
    }
  }

  const filtrar = movimientos.filter(m =>
    m.movimiento.toLowerCase().includes(filtro.toLowerCase()) ||
    (m.documento || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (m.cliente || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (m.empleado || "").toLowerCase().includes(filtro.toLowerCase())
  );

  const totalIngresosC = filtrar.reduce((sum, m) => {
    if (m.tipo === "Venta" || m.tipo === "Ingreso") return sum + m.pagos.filter(p => p.moneda === "C$").reduce((s,p)=>s+p.monto,0);
    return sum;
  }, 0);

  const totalIngresosD = filtrar.reduce((sum, m) => {
    if (m.tipo === "Venta" || MovimientoCaja.tipo === "Ingreso") return sum + m.pagos.filter(p => p.moneda === "$").reduce((s,p)=>s+p.monto,0);
    return sum;
  }, 0);

  const totalEgresosC = filtrar.reduce((sum, m) => m.tipo === "Egreso" ? sum + m.pagos.filter(p => p.moneda === "C$").reduce((s,p)=>s+p.monto,0) : sum, 0);
  const totalEgresosD = filtrar.reduce((sum, m) => m.tipo === "Egreso" ? sum + m.pagos.filter(p => p.moneda === "$").reduce((s,p)=>s+p.monto,0) : sum, 0);

  const verDetalle = (m) => {
    if (m.tipo === "Venta") {
      const lista = m.pagos.map(p => `
        <div style="background:#f1f5f9; margin:8px 0; padding:8px 12px; border-left:4px solid #2563eb; border-radius:6px">
          <b>${p.metodo}</b> - ${p.monto} ${p.moneda}
          ${p.referencia ? `<div style="font-size:13px">Referencia: <em>${p.referencia}</em></div>` : ""}
        </div>
      `).join("");

      const totalC = m.pagos.filter(p=>p.moneda==="C$").reduce((s,p)=>s+p.monto,0);
      const totalD = m.pagos.filter(p=>p.moneda==="$").reduce((s,p)=>s+p.monto,0);

      Swal.fire({
        title: `<h3 style='color:#1e3a8a'>💵 Detalle de Pagos - ${m.documento}</h3>`,
        html: `${lista}
          <hr style="margin:10px 0"/>
          <div style="text-align:center; font-size:15px; color:#1e3a8a">
            <b>Total C$:</b> ${totalC} <br/>
            <b>Total $:</b> ${totalD}
          </div>
        `,
        confirmButtonText: "Cerrar",
        customClass: { popup: 'rounded-xl p-5' }
      });
    }

    if (m.tipo === "Ingreso" || m.tipo === "Egreso") {
      Swal.fire({
        title: `<h3 style='color:#1e3a8a'>${m.tipo} de Caja - ${m.documento}</h3>`,
        html: `
          <div style='text-align:left; font-size:15px'>
            <b>Empleado:</b> ${m.empleado}<br/>
            <b>Fecha:</b> ${m.fecha}<br/>
            <b>Motivo:</b> ${m.motivo}<br/>
            <b>Observación:</b> ${m.observacion}<br/>
            <hr/>
            <b>Total C$:</b> ${m.montoCordoba} <br/>
            <b>Total $:</b> ${m.montoDolar}
          </div>
        `,
        confirmButtonText: "Cerrar",
        customClass: { popup: 'rounded-xl p-5' }
      });
    }
  };

  return (
    <Layout>
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        <BadgeDollarSign /> Movimientos de Caja
      </h1>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar movimiento, documento, cliente o empleado"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border rounded px-4 py-2 w-full text-center focus:ring-2 focus:ring-blue-300"
          />
          <Search className="absolute right-3 top-3 text-blue-500" size={18} />
        </div>
      </div>

      <table className="w-full border text-center mt-6">
        <thead className="bg-blue-100">
          <tr>
            <th>Tipo</th><th>N° Mov</th><th>Doc</th><th>Empleado</th><th>Cliente</th><th>Fecha</th>
            <th>Ingreso C$</th><th>Ingreso $</th><th>Egreso C$</th><th>Egreso $</th>
          </tr>
        </thead>
        <tbody>
          {filtrar.map(m => (
            <tr key={m.id} className="border-t hover:bg-blue-50" onContextMenu={(e) => { e.preventDefault(); verDetalle(m); }}>
              <td>{m.tipo}</td>
              <td>{m.movimiento}</td>
              <td>{m.documento}</td>
              <td>{m.empleado}</td>
              <td>{m.cliente || "-"}</td>
              <td>{m.fecha}</td>
              <td>
                {m.tipo==="Venta" || m.tipo === "Ingreso" ? m.pagos.filter(p=>p.moneda==="C$").reduce((s,p)=>s+p.monto,0) :
                 0} C$
              </td>
              <td>
                {m.tipo==="Venta" || m.tipo === "Ingreso" ? m.pagos.filter(p=>p.moneda==="$").reduce((s,p)=>s+p.monto,0) : 0} $
              </td>
              <td>{m.tipo==="Egreso" ? m.pagos.filter(p=>p.moneda==="C$").reduce((s,p)=>s+p.monto,0) : 0} C$</td>
              <td>{m.tipo==="Egreso" ? m.pagos.filter(p=>p.moneda==="$").reduce((s,p)=>s+p.monto,0) : 0} $</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-blue-50 font-bold">
          <tr>
            <td colSpan="6" className="text-right p-2">Total:</td>
            <td>{totalIngresosC} C$</td>
            <td>{totalIngresosD} $</td>
            <td>{totalEgresosC} C$</td>
            <td>{totalEgresosD} $</td>
          </tr>
          <tr>
            <td colSpan="6" className="text-right p-2">Saldo Neto:</td>
            <td colSpan="2" className="text-green-700">{(totalIngresosC - totalEgresosC).toFixed(2)} C$</td>
            <td colSpan="2" className="text-green-700">{(totalIngresosD - totalEgresosD).toFixed(2)} $</td>
          </tr>
        </tfoot>
      </table>
    </div>
    </Layout>
  );
}
