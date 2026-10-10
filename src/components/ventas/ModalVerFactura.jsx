import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const ModalVerFactura = ({ factura, setMostrarFactura }) => {
    const [dia, mes, anio] = (factura?.fecha?.split("-") ?? []).map(Number);

    const fechaFormateada = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const InfoField = ({ label, value }) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
            <div className="px-3 py-2.5 rounded-xl border bg-slate-50 text-sm font-medium text-slate-700 border-slate-200">
                {value || "—"}
            </div>
        </div>
    );

    return (
        <Dialog open={factura !== null} onOpenChange={() => setMostrarFactura(null)}>
            <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-auto p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                        Factura <span className="text-blue-600">#{factura.numeroVenta}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <InfoField label="Cliente" value={factura.cliente} />
                    <InfoField label="Término de Pago" value={factura.termino} />
                    <InfoField label="Sucursal" value={factura.sucursal} />
                    <InfoField label="Empleado" value={factura.empleado} />
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</label>
                        <Input type="date" value={fechaFormateada} className="rounded-xl bg-slate-50 border-slate-200" disabled />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {factura.detalles.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.referencia || ""}</TableCell>
                                <TableCell>C$ {item.precioUnitario.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Input type="number" min="1" value={item.cantidad} disabled/>
                                </TableCell>
                                <TableCell>C$ {(item.precioUnitario * item.cantidad).toFixed(2)}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="text-right mt-4">
                    <p className="text-lg font-semibold">Total: C$ {factura.total.toFixed(2)}</p>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setMostrarFactura(null)}>Cancelar</Button>
                    {/* <Button onClick={guardarFactura} className="bg-green-600 text-white hover:bg-green-700">Guardar</Button> */}
                    <Button onClick={() => window.print()} className="bg-blue-600 text-white hover:bg-blue-700">Imprimir</Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}
export default ModalVerFactura;
