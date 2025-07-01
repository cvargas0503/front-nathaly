import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { obtenerDatosProductosFacturacion } from "../../services/datos";
const ModalProductosCompra = ({ mostrarModal, setMostrarModal, productosSeleccionados, agregarProducto, destino }) => {
    const [busqueda, setBusqueda] = useState("");
    const [productosDisponibles, setProductos] = useState([]);


     useEffect(() => {
        if (mostrarModal) {
            setBusqueda("");
            fetchProductos();

        }
    }, [mostrarModal]);
    const fetchProductos = async () => {
        try {
            const res = await obtenerDatosProductosFacturacion(destino);
            console.log("Productos obtenidos:", res);
            if (res.success) {
                setProductos(res.data);
            }

        } catch (error) {
            console.error("Error al obtener los productos:", error);
            toast.error("Error al cargar los productos.");
        }

    }

    const productosFiltrados = productosDisponibles.filter((p) =>
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.referencia.toLowerCase().includes(busqueda.toLowerCase())
    );
    return (
        <Dialog open={mostrarModal} onOpenChange={setMostrarModal}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white rounded-xl px-4">Agregar Producto</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <h3 className="text-lg font-semibold mb-2">Buscar Producto</h3>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {productosFiltrados.map((producto) => (
                        <li
                            key={producto.idProducto}
                            className="flex justify-between items-center border p-2 rounded-xl hover:bg-gray-50"
                        >
                            <div className="text-left">
                                <div className="font-semibold text-sm">{producto.descripcion}</div>
                                <div className="text-xs text-gray-500">Código: {producto.codigo} | Ref: {producto.referencia}</div>
                            </div>
                            {productosSeleccionados.some((p) => p.idProducto === producto.idProducto) ? (
                                <div className="text-xs text-gray-400 italic">Ya agregado</div>
                            ) : (
                                <Button
                                    onClick={() => agregarProducto(producto)}
                                    className="px-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Seleccionar
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}

export default ModalProductosCompra;