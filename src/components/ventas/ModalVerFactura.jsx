import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
const ModalVerFactura = ({factura, setMostrarFactura }) => {

// Separar el string en día, mes y año
    const [dia, mes, anio] = factura.fecha?.split("-").map(Number);
    console.log(factura.fecha, dia, mes, anio, typeof factura.fecha);

    // Crear el objeto Date (mes en JavaScript va de 0 a 11)
// Formatear la fecha como YYYY-MM-DD
    const fechaFormateada = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return (
        <Dialog open={factura !== null} onOpenChange={() => setMostrarFactura(null)}>
            {/* <Loader2 className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${cargando ? "block" : "hidden"}`} /> */}

            <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto px-4 sm:px-8 py-8">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4">Factura No: {factura.numeroVenta}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
                    <select value={factura.cliente} className="border rounded p-3 w-full" disabled>
                        <option>{factura.cliente}</option>
                    </select>
                    <select value={factura.termino} className="border rounded p-3 w-full" disabled>
                        <option value={factura.termino}>{factura.termino}</option>
                    </select>
                    <select value={factura.sucursal} className="border rounded p-3 w-full" disabled>
                        <option value={factura.sucursal}>{factura.sucursal}</option>
                    </select>
                    <select value={factura.empleado} className="border rounded p-3 w-full" disabled>
                        <option value={factura.empleado}>{factura.empleado}</option>
                    </select>
                    <Input type="date" value={fechaFormateada} className="w-full" disabled/>
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