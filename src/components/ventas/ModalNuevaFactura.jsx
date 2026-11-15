import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { obtenerDatosFormularioFactura } from "../../services/datos";
import ModalMostrarProductos from "./ModalMostrarProductos";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { NuevaVenta } from "../../services/venta";
import { createInvoiceSubmission } from "../../lib/invoiceSubmission";
const ModalNuevaFactura = ({ mostrarNuevaFactura, setMostrarNuevaFactura, setFacturas }) => {
    const [clientes, setClientes] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [terminosPago, setTerminosPago] = useState([]);
    const [mostrarSelectorProducto, setMostrarSelectorProducto] = useState(false);
    const [form, setForm] = useState({ idCliente: 0, idTermino: 0, idSucursal: 0, idEmpleado: 0, fecha: new Date().toISOString().substring(0, 10) });
    const [detalle, setDetalle] = useState([]);
    const [cargando, setCargando] = useState(false);
    const solicitud = useRef(createInvoiceSubmission());
    const enviando = useRef(false);


    useEffect(() => {
        if (mostrarNuevaFactura) {
            cargarDatosIniciales();
        } else {
            solicitud.current.clear();
            setEmpleados([]);
            setClientes([]);
            setSucursales([]);
            setTerminosPago([]);
        }
    }, [mostrarNuevaFactura])

    const cargarDatosIniciales = async () => {
        const res = await obtenerDatosFormularioFactura();
        console.log(res)
        if (res.success) {
            setSucursales(res.data.sucursales);
            setClientes(res.data.clientes);
            setTerminosPago(res.data.terminos);
            setEmpleados(res.data.empleados)
        }
    };
    const agregarProductoADetalle = (producto) => {
        if (detalle.some(item => item.producto.idProducto === producto.idProducto)) {
            console.log("Producto ya agregado al detalle");
            toast.error("Este producto ya fue agregado al detalle.");
            return;
        }
        setDetalle((prev) => [
            ...prev,
            { producto, cantidad: 1, precio: producto.precios[0].precio }
        ]);
        setMostrarSelectorProducto(false);
    };

    const eliminarProducto = (index) => {
        setDetalle((prev) => prev.filter((_, i) => i !== index));
    };

    const actualizarCantidad = (index, cantidad) => {
        setDetalle((prev) => {
            const actualizado = [...prev];
            actualizado[index].cantidad = cantidad;
            return actualizado;
        });
    };

    const actualizarPrecio = (index, precio) => {
        setDetalle((prev) => {
            const actualizado = [...prev];
            actualizado[index].precio = precio;
            return actualizado;
        });
    };

    const limpiarFormulario = () => {
        solicitud.current.clear();
        setForm({ idCliente: 0, idTermino: 0, idSucursal: 0, idEmpleado: 0, fecha: new Date().toISOString().substring(0, 10) });
        setDetalle([]);
        setMostrarNuevaFactura(false);
    }
    const totalFactura = detalle.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
    const validarFormulario = () => {
        if (!form.idCliente) {
            toast.error("Seleccione un cliente.");
            return false;
        }
        if (!form.idTermino) {
            toast.error("Seleccione un tÃ©rmino de pago.");
            return false;
        }
        if (!form.idSucursal) {
            toast.error("Seleccione una sucursal.");
            return false;
        }
        if (!form.idEmpleado) {
            toast.error("Seleccione un empleado.");
            return false;
        }
        if (!form.fecha) {
            toast.error("Seleccione una fecha.");
            return false;
        }
        if (detalle.length === 0) {
            toast.error("Agregue al menos un producto.");
            return false;
        }
        for (const item of detalle) {
            if (!item.cantidad || item.cantidad < 1) {
                toast.error("La cantidad de cada producto debe ser mayor a 0.");
                return false;
            }
            if (!item.precio || item.precio < 0) {
                toast.error("El precio de cada producto debe ser vÃ¡lido.");
                return false;
            }
        }
        return true;
    };
    const guardarFactura = async () => {
        if (enviando.current || !validarFormulario()) return;
        enviando.current = true;
        setCargando(true);
        try {
            const venta = {
                ...form,
                detalles: detalle.map(item => ({
                    idProducto: item.producto.idProducto,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio,
                    descuento: 0
                }))
            };
            const res = await NuevaVenta(venta, solicitud.current.keyFor(venta));
            if (res.success) {
                toast.success("Factura guardada exitosamente.");
                setFacturas(prev => [...prev, res.data]);
                limpiarFormulario();
            } else {
                toast.error(res.message || "Error al guardar la factura.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "OcurriÃ³ un error inesperado.");
        } finally {
            enviando.current = false;
            setCargando(false);
        }
    };

    const handleOnOpenChange = (open) => {
        if (!open && detalle.length > 0) {
            if (!confirm("Tiene productos agregados. Â¿Desea descartar los cambios?")) return;
        }
        if (!open) limpiarFormulario();
    };

    return (
        <Dialog open={mostrarNuevaFactura} onOpenChange={handleOnOpenChange}>
            {cargando && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}

            <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-auto p-8 border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                        Nueva Factura
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Cliente</label>
                        <select value={form.idCliente} onChange={(e) => setForm({ ...form, idCliente: parseInt(e.target.value, 10) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none">
                            <option value={0}>Seleccionar Cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.idCliente} value={cliente.idCliente}>{cliente.nombreCompleto}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">TÃ©rmino de Pago</label>
                        <select value={form.idTermino} onChange={(e) => setForm({ ...form, idTermino: parseInt(e.target.value, 10) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none">
                            <option value={0}>Seleccionar TÃ©rmino</option>
                            {terminosPago.map((termino) => (
                                <option key={termino.idTermino} value={termino.idTermino}>{termino.codigo} ({termino.diasPlazo} dÃ­as)</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Sucursal</label>
                        <select value={form.idSucursal} onChange={(e) => setForm({ ...form, idSucursal: parseInt(e.target.value, 10) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none">
                            <option value={0}>Seleccionar Sucursal</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.idSucursal} value={sucursal.idSucursal}>{sucursal.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Empleado</label>
                        <select value={form.idEmpleado} onChange={(e) => setForm({ ...form, idEmpleado: parseInt(e.target.value, 10) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none">
                            <option value={0}>Seleccionar Empleado</option>
                            {empleados.map((empleado) => (
                                <option key={empleado.idEmpleado} value={empleado.idEmpleado}>{empleado.nombreCompleto}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Fecha</label>
                        <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="rounded-xl border-slate-200 focus:ring-blue-500/20" />
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 text-sm font-medium">Gestionar los productos de la factura</p>
                    <Button onClick={() => setMostrarSelectorProducto(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">
                        + Agregar Producto
                    </Button>
                </div>

                {mostrarSelectorProducto && (
                    <ModalMostrarProductos
                        setMostrarSelectorProducto={setMostrarSelectorProducto}
                        mostrarSelectorProducto={mostrarSelectorProducto}
                        agregarProductoADetalle={agregarProductoADetalle}
                        idSucursal={form.idSucursal}
                    />
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Tipo de Precio</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {detalle.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.producto.referencia}</TableCell>
                                <TableCell>
                                    <select value={item.precio} onChange={(e) => actualizarPrecio(index, parseFloat(e.target.value))}>
                                        {item.producto.precios.map((p, i) => (
                                            <option key={i} value={p.precio}>{p.tipoPrecio}</option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell>C$ {item.precio.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Input type="number" min="1" value={item.cantidad} onChange={(e) => actualizarCantidad(index, parseInt(e.target.value))} />
                                </TableCell>
                                <TableCell>C$ {(item.precio * item.cantidad).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button size="icon" variant="ghost" onClick={() => eliminarProducto(index)}>
                                        <IoTrashOutline />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="text-right mt-4">
                    <p className="text-lg font-semibold">Total: C$ {totalFactura.toFixed(2)}</p>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={limpiarFormulario}>Cancelar</Button>
                    <Button onClick={guardarFactura} disabled={cargando} className="bg-green-600 text-white hover:bg-green-700">Guardar</Button>
                    <Button onClick={() => window.print()} className="bg-blue-600 text-white hover:bg-blue-700">Imprimir</Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}
export default ModalNuevaFactura;
