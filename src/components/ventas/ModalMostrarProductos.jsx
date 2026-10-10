import { uploadUrl } from '../../lib/apiConfig';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { obtenerDatosProductosFacturacion } from "../../services/datos";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ModalMostrarProductos = ({ setMostrarSelectorProducto, mostrarSelectorProducto, agregarProductoADetalle, idSucursal }) => {
    const [buscarProducto, setBuscarProducto] = useState("");
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (mostrarSelectorProducto) {
            if (!idSucursal) {
                toast.error("Debe seleccionar una sucursal primero.");
                setMostrarSelectorProducto(false);
                return;
            }
            cargarProductos();
        }
    }, [mostrarSelectorProducto, idSucursal]);

    const cargarProductos = async () => {
        setCargando(true);
        try {
            const res = await obtenerDatosProductosFacturacion(idSucursal);
            if (res.success) {
                setProductos(res.data);
            }
        } finally {
            setCargando(false);
        }
    };

    const productosFiltrados = productos.filter((p) =>
        p.referencia?.toLowerCase().includes(buscarProducto.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(buscarProducto.toLowerCase())
    );

    return (
        <Dialog open={mostrarSelectorProducto} onOpenChange={setMostrarSelectorProducto}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800">Seleccionar Producto</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <Input
                        placeholder="Buscar por descripción, código o referencia..."
                        value={buscarProducto}
                        onChange={(e) => setBuscarProducto(e.target.value)}
                        className="rounded-xl border-slate-200"
                    />

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {cargando ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-500 text-sm animate-pulse">Cargando productos...</p>
                            </div>
                        ) : productosFiltrados.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                No se encontraron productos.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                                {productosFiltrados.map((producto) => (
                                    <div
                                        key={producto.idProducto}
                                        onClick={() => agregarProductoADetalle(producto)}
                                        className="group border border-slate-200 p-4 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all bg-white"
                                    >
                                        <div className="aspect-square bg-slate-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center border border-slate-100">
                                            <img
                                                src={producto.imagenUrl ? uploadUrl(producto.imagenUrl) : "https://via.placeholder.com/150"}
                                                alt={producto.referencia}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-tight">{producto.codigo}</p>
                                            <p className="font-bold text-slate-800 text-sm line-clamp-1">{producto.referencia}</p>
                                            <div className="flex justify-between items-center pt-2">
                                                <p className="text-lg font-black text-slate-900">C$ {producto.precios?.[0]?.precio?.toFixed(2) || "0.00"}</p>
                                                <div className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold">
                                                    Stock: {producto.stockBodegaPrincipal}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t mt-4">
                    <Button variant="outline" onClick={() => setMostrarSelectorProducto(false)} className="rounded-xl">
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ModalMostrarProductos;
