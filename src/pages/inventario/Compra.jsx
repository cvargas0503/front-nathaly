import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import Layout from "../../components/general/layout";
import { obtenerDatosFormularioCompra } from "../../services/datos";
import ModalProductosCompra from "../../components/compras/ModalProductosCompra";
import { guardarCompra } from "../../services/compras";

export default function CompraFormulario() {
  const [proveedores, setProveedores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busquedaTabla, setBusquedaTabla] = useState("");
  const [form, setForm] = useState({
    idProveedor: 0,
    numeroCompra: "CMP-??????????",
    fecha: new Date().toISOString().split("T")[0],
    idSucursal: 0,
    idEmpleado: 0,
    idBodega: 0,
  });

  useEffect(() => {
    fetchDatosIniciales();
  },[]);

  const fetchDatosIniciales = async () => {
    try
    {
      const res = await obtenerDatosFormularioCompra();
      if (res.success) {
        setProveedores(res.data.proveedores);
        setSucursales(res.data.sucursales);
        setEmpleados(res.data.empleados);
      }

    }catch (error) {
      console.error("Error al cargar los datos iniciales:", error);
      toast.error("Error al cargar los datos iniciales.");
    }
  }

  const agregarProducto = (producto) => {
    const yaExiste = productosSeleccionados.some((p) => p.idProducto === producto.idProducto);
    if (yaExiste) {
      toast.warning(`El producto "${producto.descripcion}" ya ha sido agregado previamente.`, { position: "top-center" });
      return;
    }
    setProductosSeleccionados((prev) => [
      ...prev,
      { ...producto, cantidad: 1, costo: 0, precio1: 0, precio2: 0, precio3: 0 }
    ]);
    setMostrarModal(false);
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) => (p.idProducto === id ? { ...p, cantidad: parseInt(cantidad) } : p))
    );
  };

  const actualizarCosto = (id, costo) => {
    const costoNum = Math.max(0, parseFloat(costo));
    if (isNaN(costoNum)) {
      toast.error("Ingrese un costo válido.", { position: "top-center" });
      return;
    }
    setProductosSeleccionados((prev) =>
      prev.map((p) => {
        if (p.idProducto === id) {
          const precio1 = Math.max(costoNum + 90, costoNum);
          const precio2 = Math.max(costoNum + 60, costoNum);
          const precio3 = Math.max(costoNum + 30, costoNum);
          return { ...p, costo: costoNum, precio1, precio2, precio3 };
        }
        return p;
      })
    );
  };

  const changeSucursal = (data) => {
    const idSucursal = parseInt(data, 10);
    if (idSucursal === 0) {
      toast.error("Debe seleccionar una sucursal válida.");
      return;
    }
    setForm({ ...form, idSucursal: idSucursal });
    const sucursalSeleccionada = sucursales.find((s) => s.idSucursal === idSucursal);
    console.log("Sucursal seleccionada:", sucursalSeleccionada);
    if (sucursalSeleccionada) {
      setBodegas(sucursalSeleccionada.bodegas || []);
    }
  }

  const limpiarFormulario = () => {
    setProductosSeleccionados([]);
    setForm({
      idProveedor: 0,
      numeroCompra: "CMP-??????????",
      fecha: new Date().toISOString().split("T")[0],
      idSucursal: 0,
      idEmpleado: 0,
      idBodega: 0,
    });
    setBusquedaTabla("");
  };

  const handleGuardarCompra = async () => {
    if (productosSeleccionados.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }
    if(productosSeleccionados.some(p => p.cantidad <= 0)) {
      toast.error("Todos los productos deben tener una cantidad mayor a 0.");
      return;
    }
    if (form.idProveedor === 0 || form.idSucursal === 0 || form.idEmpleado === 0 || form.idBodega === 0) {
      toast.error("Debe completar todos los campos obligatorios.");
      return;
    }
    try
    {
      const productos =  productosSeleccionados.map((p) => ({
          idProducto: p.idProducto,
          cantidad: p.cantidad,
          costoUnit: p.costo,
          }))
      const compraData = {
        ...form,
        productos:productos
        
      };
      console.log("Datos de compra a guardar:", compraData);

      const response = await guardarCompra(compraData);
      if (!response.success) {
        toast.error("Error al guardar la compra: " + response.message);
        return;
      }
      toast.success("Compra guardada exitosamente.");
      limpiarFormulario();
    }catch (error) {
      console.error("Error al guardar la compra:", error);
      toast.error("Error al guardar la compra. Por favor, intente nuevamente.");
      return;
    }
  };

 

  const productosTabla = productosSeleccionados.filter((p) =>
    p.descripcion.toLowerCase().includes(busquedaTabla.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busquedaTabla.toLowerCase()) ||
    p.referencia.toLowerCase().includes(busquedaTabla.toLowerCase())
  );

  return (
    <Layout>
    <div className="p-6 max-w-6xl mx-auto space-y-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800">Formulario de Compra</h1>

      <Card className="p-6 rounded-3xl shadow-md border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            value={form.numeroCompra}
            readOnly
            className="border border-gray-300 px-4 py-2 rounded-xl bg-gray-100 text-gray-500"
          />
          <select
            value={form.idProveedor}
            onChange={(e) => setForm({ ...form, idProveedor: parseInt(e.target.value, 10) })}
            className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value={0} disabled>Seleccione un proveedor</option>
            {proveedores.map((prov, i) => (
              <option key={prov.idProveedor} value={prov.idProveedor}>{prov.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={form.idSucursal}
            onChange={(e) => changeSucursal(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value={0} disabled>Seleccione una sucursal destino</option>
            {sucursales.map((sucursal, i) => (
              <option key={i} value={sucursal.idSucursal}>{sucursal.nombre}</option>
            ))}
          </select>
          <select
            value={form.idBodega}
            onChange={(e) => setForm({ ...form, idBodega: parseInt(e.target.value, 10) })}
            className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value={0} disabled>Seleccione la bodega destino</option>
            {bodegas.map((bodega, i) => (
              <option key={i} value={bodega.idBodega}>{bodega.nombre}</option>
            ))}
          </select>
          <select
            value={form.idEmpleado}
            onChange={(e) => setForm({ ...form, idEmpleado: parseInt(e.target.value,10) })}
            className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value={0} disabled>Seleccione el empleado</option>
            {empleados.map((e, i) => (
              <option key={i} value={e.idEmpleado}>{e.nombreCompleto}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-4 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Productos a Comprar</h2>
          <ModalProductosCompra
          agregarProducto={agregarProducto}
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          productosSeleccionados={productosSeleccionados}
          destino={form.idSucursal}
          />
        </div>

        <input
          type="text"
          placeholder="Buscar en productos agregados..."
          value={busquedaTabla}
          onChange={(e) => setBusquedaTabla(e.target.value)}
          className="w-full mb-4 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <table className="w-full text-sm text-center border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2">Código</th>
              <th className="py-2">Referencia</th>
              <th className="py-2">Descripción</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2">Costo</th>
              <th className="py-2">Precio 1</th>
              <th className="py-2">Precio 2</th>
              <th className="py-2">Precio 3</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {productosTabla.map((p, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">{p.codigo}</td>
                <td className="py-2">{p.referencia}</td>
                <td className="py-2">{p.descripcion}</td>
                <td className="py-2">
                  <input
                    type="number"
                    min={1}
                    value={p.cantidad}
                    onChange={(e) => actualizarCantidad(p.idProducto, e.target.value)}
                    className="border border-gray-300 px-2 py-1 w-20 rounded-lg text-center"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={p.costo}
                    onChange={(e) => actualizarCosto(p.idProducto, e.target.value)}
                    className="border border-gray-300 px-2 py-1 w-24 rounded-lg text-center"
                  />
                </td>
                <td className="py-2">{p.precio1}</td>
                <td className="py-2">{p.precio2}</td>
                <td className="py-2">{p.precio3}</td>
                <td className="py-2">
                  {((p.cantidad || 0) * (p.costo || 0)).toFixed(2)} 
                </td>
              </tr>
            ))}
            {productosTabla.length === 0 && (
              <tr>
                <td colSpan={8} className="py-4 italic text-gray-400">
                  No hay productos seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-3 flex w-full justify-between items-center">
          <div className="bg-gray-50 rounded-xl p-4 w-full shadow border border-gray-200">
            {/* <h3 className="font-semibold text-lg mb-2 text-gray-700">Totales de la Compra</h3>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal:</span>
              <span>
                {productosSeleccionados
                  .reduce((acc, p) => acc + (p.cantidad || 0) * (p.costo || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">IVA (12%):</span>
              <span>
                {(
                  productosSeleccionados.reduce((acc, p) => acc + (p.cantidad || 0) * (p.costo || 0), 0) *
                  0.12
                ).toFixed(2)}
              </span>
            </div> */}
            <div className="flex justify-between font-bold border-t mt-2 pt-2">
              <span className="text-gray-800">Total:</span>
              <span>
                {(
                  productosSeleccionados.reduce((acc, p) => acc + (p.cantidad || 0) * (p.costo || 0), 0) *
                  1.12
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={limpiarFormulario} className="bg-gray-500 text-white px-4 py-2 rounded-xl">Limpiar</Button>
          <Button onClick={handleGuardarCompra} className="bg-green-600 text-white px-4 py-2 rounded-xl">Guardar Compra</Button>
        </div>
      </Card>
    </div>
    </Layout>
  );
}
