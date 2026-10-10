// Refactor limpio, organizado y profesional
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { IoEyeOutline, IoPrintOutline, IoTrashOutline, IoCheckmarkCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Layout from "../../components/general/layout";
import ModalNuevoPedido from "../../components/ventas/ModalNuevoPedido";
import VentaCarta from "../../components/ventas/VentaCarta";
import ModalVerPedido from "../../components/ventas/ModalVerPedido";
import { ConvertirPedido, EliminarPedido, ObtenerPedidos } from "../../services/pedido";

const Pedidos = () => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtro, setFiltro] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [mostrarNuevaPedido, setMostrarNuevaPedido] = useState(false);
    const [verPedido, setVerPedido] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [dialogo, setDialogo] = useState({ tipo: null, abierto: false });
    const [menuImpresion, setMenuImpresion] = useState({ abierto: false, id: null, x: 0, y: 0 });
    const [pedidoParaImprimir, setPedidoParaImprimir] = useState(null);
    const [mostrarModalImprimirCarta, setMostrarModalImprimirCarta] = useState(false);

    const pedidosFiltrados = pedidos.filter(p =>
        p.numeroPedido.toString().includes(filtro) ||
        p.empleado.toLowerCase().includes(filtro.toLowerCase()) ||
        p.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
        p.sucursal.toLowerCase().includes(filtro.toLowerCase())
    );

    const pedidosPaginados = pedidosFiltrados.slice((paginaActual - 1) * 7, paginaActual * 7);

    useEffect(() => { cargarPedidos(); }, []);

    const cargarPedidos = async () => {
        try {
            const res = await ObtenerPedidos();
            if (res.success) setPedidos(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar los pedidos.");
        }
    };

    const anularPedido = async () => {
        try {
            const res = await EliminarPedido(pedidoSeleccionado.idPedido);
            if (res.success) {
                setPedidos(pedidos.filter(p => p.idPedido !== pedidoSeleccionado.idPedido));
                toast.success(`Pedido ${pedidoSeleccionado.numeroPedido} anulado.`);
            }
        } catch {
            toast.error("Error al anular el pedido.");
        }
        setDialogo({ tipo: null, abierto: false });
    };

    const convertirPedido = async () => {
        try {
            const res = await ConvertirPedido(pedidoSeleccionado.idPedido);
            if (res.success) {
                setPedidos(pedidos.map(p => p.idPedido === pedidoSeleccionado.idPedido ? { ...p, estado: "CONVERTIDO A VENTA", codigoEstado: "FACTUR" } : p));
                toast.success(`Pedido ${pedidoSeleccionado.numeroPedido} convertido a venta.`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Ocurrió un error inesperado.");
        }
        setDialogo({ tipo: null, abierto: false });
    };

    const imprimirCarta = () => {
        const contenido = document.getElementById("area-impresion").innerHTML;
        const iframe = document.createElement("iframe");
        Object.assign(iframe.style, { position: "fixed", width: 0, height: 0, border: 0 });
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`<html><head><style>body{font-family:Arial}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:center}</style></head><body>${contenido}</body></html>`);
        doc.close();
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    useEffect(() => {
        if (!menuImpresion.abierto) return;
        const close = () => setMenuImpresion({ abierto: false, id: null });
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, [menuImpresion.abierto]);

    return (
        <Layout>
            <div className="p-4 md:p-8">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Listado de Pedidos</h1>
                    <div className="flex gap-2">
                        <input className="border rounded px-3 py-2 text-sm" placeholder="Buscar..." value={filtro} onChange={e => { setFiltro(e.target.value); setPaginaActual(1); }} />
                        <Button className="gap-2" onClick={() => setMostrarNuevaPedido(true)}><IoAddCircleOutline />Nuevo Pedido</Button>
                    </div>
                </div>

                <Card><CardContent className="overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>N° Pedido</TableHead><TableHead>Empleado</TableHead><TableHead>Cliente</TableHead><TableHead>Fecha</TableHead><TableHead>Monto</TableHead><TableHead>Estado</TableHead><TableHead>Sucursal</TableHead><TableHead className="text-right">Opciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidosPaginados.length ? pedidosPaginados.map(p => {
                                const estadoColor = p.codigoEstado === "FACTUR" ? "bg-green-100 text-green-700"
                                    : p.codigoEstado === "ANULADO" ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700";

                                const puedeAnular = p.codigoEstado !== "ANULADO";
                                const puedeConvertir = p.codigoEstado !== "FACTUR" && p.codigoEstado !== "ANULADO";

                                return (
                                    <TableRow key={p.idPedido}>
                                        <TableCell>{p.numeroPedido}</TableCell>
                                        <TableCell>{p.empleado}</TableCell>
                                        <TableCell>{p.cliente}</TableCell>
                                        <TableCell>{p.fecha}</TableCell>
                                        <TableCell>C$ {p.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${estadoColor}`}>
                                                {p.estado}
                                            </span>
                                        </TableCell>
                                        <TableCell>{p.sucursal}</TableCell>
                                        <TableCell className="text-right space-x-2 relative">
                                            <Button size="icon" variant="outline" onClick={() => setDialogo({ tipo: "anular", abierto: true }) || setPedidoSeleccionado(p)} disabled={!puedeAnular}>
                                                <IoTrashOutline />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={() => setDialogo({ tipo: "convertir", abierto: true }) || setPedidoSeleccionado(p)} disabled={!puedeConvertir}>
                                                <IoCheckmarkCircleOutline />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={() => setVerPedido(p)}>
                                                <IoEyeOutline />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={e => {
                                                e.stopPropagation();
                                                const r = e.currentTarget.getBoundingClientRect();
                                                setMenuImpresion({ abierto: true, id: p.idPedido, x: r.left, y: r.bottom + window.scrollY });
                                            }}>
                                                <IoPrintOutline />
                                            </Button>

                                            {menuImpresion.abierto && menuImpresion.id === p.idPedido && (
                                                <div className="absolute z-50 bg-white border rounded shadow py-1 w-40 right-0 top-10" onClick={e => e.stopPropagation()}>
                                                    <button className="block w-full px-4 py-2 hover:bg-gray-100" onClick={() => setPedidoParaImprimir(p) || setMostrarModalImprimirCarta(true)}>Imprimir carta</button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            }) : (
                                <TableRow><TableCell colSpan={8} className="text-center py-8">No hay pedidos.</TableCell></TableRow>
                            )}
                        </TableBody>

                    </Table>
                </CardContent></Card>

                {Math.ceil(pedidosFiltrados.length / 7) > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {[...Array(Math.ceil(pedidosFiltrados.length / 7))].map((_, i) => (
                            <Button key={i} size="sm" variant={paginaActual === i + 1 ? "default" : "outline"} onClick={() => setPaginaActual(i + 1)}>{i + 1}</Button>
                        ))}
                    </div>
                )}

                {/* Dialogos */}
                <Dialog open={dialogo.abierto && dialogo.tipo === "anular"} onOpenChange={() => setDialogo({ tipo: null, abierto: false })}>
                    <DialogContent className="max-w-md">
                        <DialogHeader><DialogTitle>Anular pedido {pedidoSeleccionado?.numeroPedido}</DialogTitle></DialogHeader>
                        <div className="text-center py-4">
                            <p>¿Está seguro que desea anular el pedido?</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <Button variant="outline" onClick={() => setDialogo({ tipo: null, abierto: false })}>Cancelar</Button>
                                <Button className="bg-red-500 text-white" onClick={anularPedido}>Anular</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={dialogo.abierto && dialogo.tipo === "convertir"} onOpenChange={() => setDialogo({ tipo: null, abierto: false })}>
                    <DialogContent className="max-w-md">
                        <DialogHeader><DialogTitle>Convertir pedido {pedidoSeleccionado?.numeroPedido}</DialogTitle></DialogHeader>
                        <div className="text-center py-4">
                            <p>¿Está seguro que desea convertir el pedido?</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <Button variant="outline" onClick={() => setDialogo({ tipo: null, abierto: false })}>Cancelar</Button>
                                <Button className="bg-green-600 text-white" onClick={convertirPedido}>Convertir</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={mostrarModalImprimirCarta} onOpenChange={() => setMostrarModalImprimirCarta(false)}>
                    <DialogContent className="max-w-[850px]">
                        <div className="flex flex-col items-center">
                            <h2 className="text-lg font-bold my-4">Vista previa - Formato Carta</h2>
                            {pedidoParaImprimir ? <div id="area-impresion"><VentaCarta venta={pedidoParaImprimir} modoImpresion /></div> : <p className="text-red-500">No se pudo cargar el pedido.</p>}
                            <div className="flex gap-4 mt-4">
                                <Button variant="outline" onClick={() => setMostrarModalImprimirCarta(false)}>Cerrar</Button>
                                <Button className="bg-green-700 text-white" onClick={imprimirCarta}>Imprimir</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <ModalNuevoPedido mostrarNuevaPedido={mostrarNuevaPedido} setMostrarNuevaPedido={setMostrarNuevaPedido} setPedidos={setPedidos} pedidos={pedidos} />
                {verPedido && <ModalVerPedido pedido={verPedido} setMostrarPedido={setVerPedido} />}
            </div>
        </Layout>
    );
};

export default Pedidos;
