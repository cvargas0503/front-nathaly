import { useState } from "react";
import { BadgeDollarSign, CheckCircle, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Layout from "../../components/general/layout";
import { registrarMovimientoAPI } from "../../services/caja";

export default function RegistroCaja() {
  const empleadoLogueado = "Juan Perez"; // Simulación de empleado logueado, reemplazar con contexto o estado global

  const [tipo, setTipo] = useState("Ingreso");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const [metodo, setMetodo] = useState("");
  const [moneda, setMoneda] = useState("");
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacion, setObservacion] = useState("");
  const [loading, setLoading] = useState(false);

  const limpiar = () => {
    setTipo("Ingreso");
    setFecha(new Date().toISOString().slice(0,10));
    setMetodo("");
    setMoneda("");
    setMonto("");
    setReferencia("");
    setMotivo("");
    setObservacion("");
  };

  const seleccionarMetodo = (m) => {
    setMetodo(m);
    if (m.includes("$")) setMoneda("$");
    else setMoneda("C$");
    if (!m.includes("Transferencia")) setReferencia("");
  };

  const guardar = async() => {
    if (!fecha) return Swal.fire({ icon: "warning", title: "La fecha es obligatoria" });
    if (!motivo.trim()) return Swal.fire({ icon: "warning", title: "El motivo es obligatorio" });
    if (monto <= 0 || isNaN(monto)) return Swal.fire({ icon: "warning", title: "El monto debe ser mayor a 0" });

    if (tipo === "Ingreso") {
      if (!metodo) return Swal.fire({ icon: "warning", title: "Selecciona el método de pago" });
      if (metodo.includes("Transferencia") && !referencia.trim()) {
        return Swal.fire({ icon: "warning", title: "La referencia de la transferencia es obligatoria" });
      }
    }

    if (tipo === "Egreso" && !moneda) {
      return Swal.fire({ icon: "warning", title: "Selecciona la moneda para el egreso" });
    }

    try
    {
      setLoading(true);
      const movimiento = {
        ingreso: tipo === "Ingreso",
        fecha,
        formaPago: {
          moneda: (metodo.includes("$") ? "USD" : "NIO") || null,
          referencia: referencia.trim() || null,
          monto: parseFloat(monto),
          idFormaPago: metodo.includes("Efectivo") ? 1 : metodo.includes("Transferencia BAC") ? 2 : metodo.includes("Transferencia BANPRO") ? 3 : 4,
        },
        concepto: motivo.trim(),
        idEmpleado: 7
      };

      const respuesta = await registrarMovimientoAPI(movimiento);
      console.log("Respuesta del servidor:", respuesta);
      if (!respuesta.success) {
        return Swal.fire({ icon: "error", title: "Error al registrar el movimiento", text: respuesta.message || "Por favor, intente nuevamente." });
      }
      Swal.fire({
      icon: "success",
      title: `${tipo} registrado correctamente`,
      html: `
        <b>Empleado:</b> ${empleadoLogueado}<br/>
        <b>Motivo:</b> ${motivo}<br/>
        <b>Monto:</b> ${monto} ${moneda}<br/>
        ${referencia ? `<b>Referencia:</b> ${referencia}<br/>` : ""}
      `,
      confirmButtonText: "Aceptar",
    });
    limpiar();

    }catch (error) {
      console.error("Error al guardar el movimiento:", error);
      return Swal.fire({ icon: "error", title: "Error al registrar el movimiento", text: error.response.data.message || "Por favor, intente nuevamente."  });
    }finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        <BadgeDollarSign /> Registrar Ingreso / Egreso
      </h1>

      <div className="space-y-3">
        <div className="flex gap-3">
          <select value={tipo} onChange={e => { setTipo(e.target.value); setMetodo(""); setMoneda(""); setReferencia(""); }} className="border rounded px-3 py-2 flex-1">
            <option>Ingreso</option>
            <option>Egreso</option>
          </select>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="border rounded px-3 py-2 flex-1" />
        </div>

        <input type="text" value={empleadoLogueado} disabled className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-600" />

        {tipo === "Ingreso" && (
          <div className="space-y-2">
            <select value={metodo} onChange={e => seleccionarMetodo(e.target.value)} className="border rounded px-3 py-2 w-full">
              <option value="">Selecciona método de pago</option>
              <option>Efectivo C$</option>
              <option>Efectivo $</option>
              <option>Transferencia BAC C$</option>
              <option>Transferencia BAC $</option>
              <option>Transferencia BANPRO C$</option>
              <option>Transferencia BANPRO $</option>
            </select>

            {metodo.includes("Transferencia") && (
              <input
                type="text"
                placeholder="N° de Referencia"
                value={referencia}
                onChange={e => setReferencia(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            )}
          </div>
        )}

        {tipo === "Egreso" && (
          <select value={moneda} onChange={e => setMoneda(e.target.value)} className="border rounded px-3 py-2 w-full">
            <option value="">Selecciona moneda</option>
            <option>C$</option>
            <option>$</option>
          </select>
        )}

        <input
          type="number"
          min="0"
          placeholder="Monto"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Concepto *"
          value={motivo}
          onChange={e => setMotivo(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <div className="flex gap-3 justify-end pt-3">
          <button onClick={limpiar} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            <Trash2 size={18} /> Limpiar
          </button>
          <button onClick={guardar} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            <CheckCircle size={18} /> Guardar
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );    
}
