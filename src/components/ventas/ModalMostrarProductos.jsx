import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { obtenerDatosProductosFacturacion } from "../../services/datos";
import { toast } from "react-toastify";
const ModalMostrarProductos = ({ setMostrarSelectorProducto, mostrarSelectorProducto, agregarProductoADetalle, idSucursal }) => {
    const [buscarProducto, setBuscarProducto] = useState("");
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        if(!idSucursal) {
            toast.error("Debe seleccionar una sucursal primero.");
            setMostrarSelectorProducto(false);
            return;
        }
        if (mostrarSelectorProducto && idSucursal) {
            cargarProductos();
        }
    }, [mostrarSelectorProducto]);

    const cargarProductos = async () => {
        const res = await obtenerDatosProductosFacturacion(idSucursal);
        if (res.success) {
            setProductos(res.data);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-[1000px] h-[90vh] overflow-y-auto bg-white border rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Buscar Producto</h2>
                    <Button variant="outline" onClick={() => setMostrarSelectorProducto(false)}>Cerrar</Button>
                </div>
                <Input
                    placeholder="Buscar por descripción, código o referencia..."
                    value={buscarProducto}
                    onChange={(e) => setBuscarProducto(e.target.value)}
                    className="mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.filter((p) => p.referencia.toLowerCase().includes(buscarProducto.toLowerCase())).map((producto) => (
                        <div
                            key={producto.idProducto}
                            onClick={() => agregarProductoADetalle(producto)}
                            className="border p-3 rounded hover:bg-gray-100 cursor-pointer transition-all"
                        >
                            <div className="aspect-video bg-gray-100 rounded mb-2">
                                <img
                                    src={`http://localhost:3000${producto.imagenUrl}` || "https://via.placeholder.com/150"}
                                    alt={producto.referencia}
                                    className="w-full h-full object-contain rounded"
                                />
                            </div>
                            <p className="font-semibold text-sm">{producto.codigo} - {producto.referencia}</p>
                            <p className="text-sm text-gray-700">{producto.descripcion}</p>
                            <p className="text-sm text-gray-600">Precio: C$100</p>
                            <p className="text-sm text-muted-foreground">Stock: {producto.stockBodegaPrincipal}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default ModalMostrarProductos;