import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const ReadOnlySelect = ({ value }) => (
    <select value={value || ""} className="border rounded p-3 w-full" disabled>
        <option>{value || ""}</option>
    </select>
);

const ModalVerPedido = ({ pedido, setMostrarPedido }) => {
    if (!pedido) return null;

    const fechaFormateada = (() => {
        if (!pedido.fecha) return "";
        const [dia, mes, anio] = pedido.fecha.split("-").map(Number);
        return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    })();

    return (
        <Dialog open={!!pedido} onOpenChange={() => setMostrarPedido(null)}>
            <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-auto px-4 sm:px-8 py-8">
                
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4">
                        Pedido No: {pedido.numeroPedido}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ReadOnlySelect value={pedido.cliente} />
                    <ReadOnlySelect value={pedido.termino} />
                    <ReadOnlySelect value={pedido.sucursal} />
                    <ReadOnlySelect value={pedido.empleado} />
                    <Input type="date" value={fechaFormateada} className="w-full" disabled />
                </div>

                <Table className="mt-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pedido.detalles?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.referencia || ""}</TableCell>
                                <TableCell>C$ {item.precioUnitario?.toFixed(2) || "0.00"}</TableCell>
                                <TableCell>
                                    <Input type="number" min="1" value={item.cantidad || 0} disabled />
                                </TableCell>
                                <TableCell>
                                    C$ {(item.precioUnitario * item.cantidad).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="text-right mt-4">
                    <p className="text-lg font-semibold">Total: C$ {pedido.total?.toFixed(2) || "0.00"}</p>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setMostrarPedido(null)}>Cerrar</Button>
                    <Button onClick={() => window.print()} className="bg-blue-600 text-white hover:bg-blue-700">Imprimir</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ModalVerPedido;
