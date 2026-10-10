import React, { useEffect, useState } from "react";
import Layout from '../../components/general/layout'
import { toast } from "react-toastify";
import { obtenerDatosFormularioTraslado } from "../../services/datos";
import ModalTraslado from "../../components/inventario/ModalTraslado";
import { crearTraslado } from "../../services/traslados";
export default function TrasladoBodega() {
  const [bodegaOrigen, setBodegaOrigen] = useState(0);
  const [bodegaDestino, setBodegaDestino] = useState(0);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bodegas, setBodegas] = useState([]);
  const [observacion, setObservacion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
  useEffect(() => {
    fetchData();
  }, []);




  const handleBodegaOrigenChange = (e) => {
    const value = e.target.value;
    if (value === bodegaDestino && value !== null) {
      toast.error("La bodega origen y destino no pueden ser la misma.");
      return;
    }
    setProductos([])
    setBodegaOrigen(value);
  };

  const handleBodegaDestinoChange = (e) => {
    const value = e.target.value;
    if (value === bodegaOrigen && value !== null) {
      toast.error("La bodega origen y destino no pueden ser la misma.");
      return;
    }
    setBodegaDestino(value);
  };
  const fetchData = async() => {
    try
    {
      const respuesta = await obtenerDatosFormularioTraslado();
      console.log("Datos de traslado:", respuesta.data);

      if (!respuesta.success) {
        toast.error("Error al cargar los datos de traslado.");
        return;
      }

      setBodegas(respuesta.data.bodegas || []);

    }
    catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.");
    }

  }


  const agregarProductoDesdeModal = (producto) => {
    setProductos([...productos, { ...producto, cantidad: 1 }]);
    setModalVisible(false);

  };

  const actualizarCantidad = (index, cantidad) => {
    const nuevos = [...productos];
    nuevos[index].cantidad = cantidad;
    setProductos(nuevos);
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };



  const abrirModal = () => {
    if (bodegaOrigen === 0 || bodegaDestino === 0) {
      toast.error("Debe seleccionar las bodegas de origen y destino.");
      return;
    }
    setModalVisible(true);
  }

  const handleTrasladar = async() => {
    if (bodegaOrigen === 0 || bodegaDestino === 0) {
      toast.error("Debe seleccionar las bodegas de origen y destino.");
      return;
    }
    if (productos.length === 0) {
      toast.error("Debe agregar al menos un producto para el traslado.");
      return;
    }
    if (bodegaOrigen === bodegaDestino) {
      toast.error("La bodega origen y destino no pueden ser la misma.");
      return;
    }
    if (observacion.trim() === "") {
      toast.error("Debe ingresar una observación para el traslado.");
      return;
    }
    try
    {
      const respuesta = await crearTraslado({
        bodegaOrigen,
        bodegaDestino,
        productos,
        observacion,
        fecha
      });
      console.log("Respuesta de traslado:", respuesta);
      if (respuesta.success) {
        toast.success("Traslado realizado con éxito.");
        setProductos([]);
        setBodegaOrigen(0);
        setBodegaDestino(0);
        setObservacion("");
        setFecha(new Date().toISOString().split('T')[0]); // Resetear fecha al día actual
      } else {
        toast.error("Error al realizar el traslado: " + respuesta.message);
      }
    }
    catch (error) {
      console.error("Error al realizar el traslado:", error);
      toast.error("Error al realizar el traslado. Por favor, inténtelo de nuevo más tarde.");
      return;
    }
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Traslado de Bodega
        </h2>

        {/* FECHA */}
        <div className="mb-6">
          <label className="block text-sm text-black-800 mb-1">Fecha:</label>
          <input
            type="date"
            className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
            onChange={(e) => setFecha(e.target.value)}
            value={fecha}

          />
        </div>

        {/* BODEGAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-black-800 mb-1">
              Bodega Origen:
            </label>
            <select
            className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
            onChange={handleBodegaOrigenChange}
            value={bodegaOrigen}
            >
              <option>Seleccionar</option>
              {bodegas.map((bodega) => (
                <option key={bodega.idBodega} value={bodega.idBodega}>{bodega.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black-800 mb-1">
              Bodega Destino:
            </label>
            <select
            className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
            onChange={handleBodegaDestinoChange}
            value={bodegaDestino}
            >
              <option>Seleccionar</option>
              {bodegas.map((bodega) => (
                <option key={bodega.idBodega} value={bodega.idBodega}>{bodega.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* EMPLEADOS */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm text-black-800 mb-1">
              Observacion

            </label>
            <textarea
              className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
              rows="3"
              placeholder="Ingrese una observación..."
              style={{ resize: "none" }}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            ></textarea>
          </div>
          {/* <div>
            <label className="block text-sm text-black-800 mb-1">
              Empleado que envía:
            </label>
            <select className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option>Seleccionar</option>
              {empleados.map((empleado, index) => (
                <option key={empleado.idEmpleado}>{empleado.nombreCompleto}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-black-800 mb-1">
              Empleado que recibe:
            </label>
            <select
            className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option>Seleccionar</option>
              {empleados.map((empleado, index) => (
                <option key={empleado.idEmpleado}>{empleado.nombreCompleto}</option>
              ))}
            </select>
          </div> */}
        </div>

        {/* PRODUCTOS */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black-800 mb-2">
            Productos a trasladar
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-2 border">Código</th>
                  <th className="p-2 border">Descripción</th>
                  <th className="p-2 border">Referencia</th>
                  <th className="p-2 border">Categoría</th>
                  <th className="p-2 border">Marca</th>
                  <th className="p-2 border">Cantidad</th>
                  <th className="p-2 border text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="border p-2">{p.codigo}</td>
                    <td className="border p-2">{p.descripcion}</td>
                    <td className="border p-2">{p.referencia}</td>
                    <td className="border p-2">{p.categoria}</td>
                    <td className="border p-2">{p.marca}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="1"
                        value={p.cantidad}
                        onChange={(e) => actualizarCantidad(i, e.target.value)}
                        className="w-20 p-1 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => eliminarProducto(i)}
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={abrirModal}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mt-4 transition duration-200"
          >
            ➕ Agregar producto
          </button>
        </div>

        {/* MODAL DE PRODUCTOS */}
        {modalVisible && (
          <ModalTraslado
          agregarProductoDesdeModal={agregarProductoDesdeModal}
          setModalVisible={setModalVisible}
          bodegaOrigen={bodegaOrigen}
          productosSeleccionados={productos}
          />
        )}

        {/* GUARDAR */}
        <div className="text-center">
          <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold shadow-md transition duration-200"
          onClick={handleTrasladar}
          >
            💾 Guardar traslado
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
}
