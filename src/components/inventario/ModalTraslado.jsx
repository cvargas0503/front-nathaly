import { useEffect, useState } from "react";
import { obtenerStockBodega } from "../../services/datos";
import { toast } from "react-toastify";

const ModalTraslado = ({ agregarProductoDesdeModal, setModalVisible, bodegaOrigen, productosSeleccionados }) => {
  const [filtro, setFiltro] = useState("");
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    try {
      const respuesta = await obtenerStockBodega(bodegaOrigen);
      if (!respuesta.success) {
        toast.error("Error al cargar el inventario de la bodega.");
        return;
      }
      setInventario(respuesta.data || []);
    } catch {
      toast.error("Error al cargar el inventario. Por favor, inténtelo de nuevo más tarde.");
    }
  };

  const productosFiltrados = inventario.filter((p) =>
    p.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
    p.codigo.toLowerCase().includes(filtro.toLowerCase())
  );

  const estaAgregado = (prod) =>
    productosSeleccionados.some(p => p.idProducto === prod.idProducto);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
        <h3 className="text-lg font-bold text-blue-900 mb-4">
          Seleccionar Producto
        </h3>
        <input
          type="text"
          placeholder="Buscar por nombre o código"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        <div className="max-h-60 overflow-y-auto">
          {productosFiltrados.map((prod, i) => {
            const yaAgregado = estaAgregado(prod);
            const sinStock = prod.stock <= 0;
            const deshabilitado = yaAgregado || sinStock;

            return (
              <div
                key={i}
                onClick={() => !deshabilitado && agregarProductoDesdeModal(prod)}
                className={`p-2 border-b rounded cursor-pointer mb-1
                  ${deshabilitado
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "hover:bg-blue-100"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{prod.descripcion}</p>
                    <p className="text-xs text-gray-500">
                      {prod.codigo} - {prod.marca} - {prod.categoria}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${prod.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    Stock: {prod.stock}
                  </span>
                </div>
                {yaAgregado && <p className="text-xs italic text-red-500">Ya agregado</p>}
                {sinStock && <p className="text-xs italic text-red-500">Sin stock disponible</p>}
              </div>
            );
          })}
        </div>
        <div className="text-right mt-4">
          <button
            onClick={() => setModalVisible(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTraslado;
