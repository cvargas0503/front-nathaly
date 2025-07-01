import { useState, useEffect } from "react";
import { BadgeDollarSign, DollarSign, Banknote, XCircle, Trash2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Layout from "../../components/general/layout";
import { ObtenerVentasPendientes } from "../../services/venta";
import { toast } from "react-toastify";
import LoadingComponent from "../../components/auth/loadingComponent";
import { confirmarPagoApi } from "../../services/caja";

export default function PagoVentas() {
  const [ventas, setVentas] = useState([]);
  const [contexto, setContexto] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [menuActivo, setMenuActivo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const tasaCambio = 37;

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const respuesta = await ObtenerVentasPendientes();
      if (!respuesta.success) {
        toast.error("Error al cargar las ventas pendientes");
        return;
      }
      setVentas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
    } finally {
      setCargando(false)
    }

  };

  const abrirPago = (e, venta) => {
    e.preventDefault();
    setContexto(venta);
    setPagos([]);
  };

  const agregarMetodo = (metodo, id) => {
    if (metodo.includes("Transferencia")) {
      Swal.fire({
        title: "Número de referencia",
        input: "text",
        inputPlaceholder: "Ingrese el número de referencia",
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) return "Debe ingresar un número de referencia";
          if (pagos.some(p => p.cuenta === value)) return "Esta referencia ya se usó en esta venta";
          return null;
        }
      }).then(result => {
        if (result.isConfirmed && result.value) {
          setPagos(prev => [...prev, { metodo, idFormaPago: id, monto: "", referencia: result.value, moneda: "NIO" }]);
          setMenuActivo(false);
        }
      });
    } else {
      setPagos(prev => [...prev, { metodo, idFormaPago: id, monto: "", referencia: "", moneda: "USD" }]);
      setMenuActivo(false);
    }
  };

  const actualizarMonto = (index, valor) => {
    const nuevos = [...pagos];
    nuevos[index].monto = valor;
    setPagos(nuevos);
  };

  const actualizarMoneda = (index, valor) => {
    const nuevos = [...pagos];
    nuevos[index].moneda = valor;
    setPagos(nuevos);
  };

  const eliminarPago = (index) => {
    const nuevos = pagos.filter((_, i) => i !== index);
    setPagos(nuevos);
  };

  const totalPagadoCordoba = pagos.reduce((sum, p) => sum + (p.moneda === "NIO" ? parseFloat(p.monto || 0) : 0), 0);
  const totalPagadoDolar = pagos.reduce((sum, p) => sum + (p.moneda === "USD" ? parseFloat(p.monto || 0) : 0), 0);
  const totalConvertido = totalPagadoCordoba + (totalPagadoDolar * tasaCambio);

  const calcularCambioCordoba = () => {
    const cambio = totalConvertido - contexto.monto;
    return cambio > 0 ? cambio.toFixed(2) : 0;
  };

  const calcularCambioDolar = () => {
    const cambioCordoba = calcularCambioCordoba();
    return (cambioCordoba / tasaCambio).toFixed(2);
  };

  const confirmarPagos = async() => {
    if (totalConvertido < contexto.monto) {
      Swal.fire({ icon: "error", title: "Monto insuficiente", text: "El total pagado no puede ser menor al total de la venta." });
      return;
    }
    try {
      console.log(contexto, pagos)
      const respuesta = await confirmarPagoApi(contexto.id, {formasPago: pagos});
      if(!respuesta.success) {
        Swal.fire({ icon: "error", title: "Error al registrar el pago", text: respuesta.message || "Por favor, intente nuevamente." });
        return;
      }
      Swal.fire({ icon: "success", title: "Pago registrado", showConfirmButton: false, timer: 1500 });
      setVentas(ventas.filter(v => v.id !== contexto.id));
      setContexto(null);
      setPagos([]);
      setMenuActivo(false);
    } catch (error) {
      console.error("Error al confirmar pagos:", error);
      Swal.fire({ icon: "error", title: "Error al registrar el pago", text: "Por favor, intente nuevamente." });
    }
  };

  const cerrarModal = () => {
    setContexto(null);
    setPagos([]);
    setMenuActivo(false);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-xl p-6 space-y-6 relative">
        {cargando && <LoadingComponent />}
        <h1 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          <BadgeDollarSign /> Pago de Ventas
        </h1>

        <table className="w-full border text-center mt-6">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2">N° Venta</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Empleado</th>
              <th className="p-2">Sucursal</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Monto</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id} className="border-t hover:bg-blue-50" onContextMenu={(e) => abrirPago(e, v)}>
                <td className="p-2 font-medium">{v.numero}</td>
                <td className="p-2">{v.cliente}</td>
                <td className="p-2">{v.empleado}</td>
                <td className="p-2">{v.sucursal}</td>
                <td className="p-2">{v.fecha}</td>
                <td className="p-2">{v.monto.toFixed(2)} C$</td>
                <td className="p-2">{v.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {contexto && (
          <motion.div className="fixed inset-0 flex justify-center items-center z-50 p-4" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4 w-full max-w-2xl text-center border-2 border-blue-200 relative">
              <button onClick={cerrarModal} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">✕</button>

              <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2 justify-center">
                <DollarSign /> Pago - Venta {contexto.numero}
              </h2>

              <p className="text-gray-600">Total a pagar: {contexto.monto.toFixed(2)} C$</p>

              {pagos.map((p, idx) => (
                <div key={idx} className="flex flex-col gap-2 items-center justify-center mb-2 animate-fade-in">
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    <p className="font-medium">{p.metodo}:</p>
                    <input
                      type="number"
                      placeholder="Monto"
                      className="border rounded px-3 py-1 w-28 text-center"
                      value={p.monto}
                      onChange={(e) => actualizarMonto(idx, e.target.value)}
                    />
                    <select value={p.moneda} onChange={(e) => actualizarMoneda(idx, e.target.value)} className="border rounded px-2 py-1">
                      <option value="USD">$</option>
                      <option value="NIO">C$</option>
                    </select>
                    {p.cuenta && <p className="text-sm text-gray-500">Ref: {p.cuenta}</p>}
                    <button onClick={() => eliminarPago(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-2 relative">
                {!menuActivo && (
                  <button onClick={() => setMenuActivo(true)} className="flex items-center gap-1 text-blue-600 hover:underline">
                    <PlusCircle /> Agregar métodos de pago
                  </button>
                )}

                {menuActivo && (
                  <div className="absolute left-0 -top-44 bg-white shadow-lg rounded border w-60 z-50 p-2 space-y-2">
                    <button onClick={() => agregarMetodo("Efectivo", 1)} className="w-full px-4 py-2 hover:bg-blue-100 flex items-center gap-2">
                      <img src="https://images.icon-icons.com/514/PNG/512/cash_icon-icons.com_51028.png" alt="LAFISE" className="w-5 h-5" />

                      Efectivo
                    </button>
                    <button onClick={() => agregarMetodo("Transferencia BAC", 2)} className="w-full px-4 py-2 hover:bg-blue-100 flex items-center gap-2">
                      <img src="data:image/png;base64,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" alt="BAC" className="w-5 h-5" />
                      Transferencia BAC
                    </button>
                    <button onClick={() => agregarMetodo("Transferencia BANPRO", 3)} className="w-full px-4 py-2 hover:bg-blue-100 flex items-center gap-2">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp1OdWQZLlIh4NnkS19HJI9jHpWP4nXbTjHw&s" alt="BANPRO" className="w-5 h-5" />
                      Transferencia BANPRO
                    </button>
                    <button onClick={() => agregarMetodo("Transferencia LAFISE", 4)} className="w-full px-4 py-2 hover:bg-blue-100 flex items-center gap-2">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwl5c2updQyrhqoqXmBoeKSogUhZkDQJn7zA&s" alt="LAFISE" className="w-5 h-5" />
                      Transferencia LAFISE
                    </button>
                    <button onClick={() => setMenuActivo(false)} className="w-full px-4 py-2 hover:bg-red-100 flex items-center gap-2 text-red-600">
                      <XCircle /> Cancelar
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mt-2">Total pagado: {totalPagadoCordoba.toFixed(2)} C$ y {totalPagadoDolar.toFixed(2)} $</p>

              {totalConvertido >= contexto.monto && (
                <p className="text-green-600">Vuelto: {calcularCambioCordoba()} C$ / {calcularCambioDolar()} $</p>
              )}

              <button
                onClick={confirmarPagos}
                disabled={totalConvertido < contexto.monto}
                className={`w-full mt-4 py-2 rounded-xl font-bold transition ${totalConvertido >= contexto.monto ? "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Confirmar Pagos
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
