import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { IoEyeOutline, IoPrintOutline, IoTrashOutline, IoCheckmarkCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Layout from "../../components/general/layout";
import ModalNuevaFactura from "../../components/ventas/ModalNuevaFactura";
import { EliminarVenta, ObtenerVentas } from "../../services/venta";
import VentaCarta from "../../components/ventas/VentaCarta";
import ModalVerFactura from "../../components/ventas/ModalVerFactura";

const Facturas = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [facturasPorPagina] = useState(7);
  const [filtro, setFiltro] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [facturaParaImprimir, setFacturaParaImprimir] = useState(null);
  const [mostrarModalImprimirCarta, setMostrarModalImprimirCarta] = useState(false);
  const [menuImpresion, setMenuImpresion] = useState({ abierto: false, id: null, x: 0, y: 0 });
  const [verFactura, setVerFactura] = useState(null);
  const facturasFiltradas = facturas.filter(
    (factura) =>
      factura.numeroVenta.toString().includes(filtro) ||
      factura.empleado.toLowerCase().includes(filtro.toLowerCase()) ||
      factura.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      factura.sucursal.toLowerCase().includes(filtro.toLowerCase())
  );

  const indiceUltimaFactura = paginaActual * facturasPorPagina;
  const indicePrimeraFactura = indiceUltimaFactura - facturasPorPagina;
  const facturasPaginadas = facturasFiltradas.slice(indicePrimeraFactura, indiceUltimaFactura);

  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setPaginaActual(1);
  };
  const handlePaginaChange = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mostrarDialogoAnular, setMostrarDialogoAnular] = useState(false);
  const [mostrarNuevaFactura, setMostrarNuevaFactura] = useState(false);

  useEffect(() => {
    obtenerFacturas();
  }, []);

  const obtenerFacturas = async () => {
    try {
      const res = await ObtenerVentas();
      console.log("Facturas obtenidas:", res);
      if (res.success) {
        setFacturas(res.data);
      }
    }
    catch (error) {
      console.error("Error al obtener las VENTAS:", error);
      toast.error("Error al cargar las VENTASs.");
    }

  }



  const confirmarAnulacion = (factura) => {
    setFacturaSeleccionada(factura);
    setMostrarDialogoAnular(true);
  };

  const handleAnularFactura = async() => {
    try
    {
      const response = await EliminarVenta(facturaSeleccionada.idVenta);
      if (!response.success) {
        throw new Error("Error al anular la factura");
      }
    setFacturas(facturas.filter(f => f.idVenta !== facturaSeleccionada.idVenta));
    toast.success(`Factura ${facturaSeleccionada.numeroVenta} anulada exitosamente.`);
    setMostrarDialogoAnular(false)
  } catch (error) {
    console.error("Error al anular la VENTAS:", error);
    toast.error("Error al anular la VENTAS. Por favor, inténtelo de nuevo más tarde.");
    }
  };

  const pagarFactura = (factura) => {
    toast.success(`Factura ${factura.numero} pagada correctamente.`);
  };

  // Funciones para imprimir
  const handleImprimir = (tipo, factura) => {
    setMenuImpresion({ abierto: false, id: null, x: 0, y: 0 });

    if (tipo === "carta") {
      setFacturaParaImprimir(factura);
      setMostrarModalImprimirCarta(true);
    } else {
      toast.info(`Imprimiendo factura ${factura.numeroVenta} en formato ${tipo}.`);
    }
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClick = () => {
      if (menuImpresion.abierto) setMenuImpresion({ abierto: false, id: null, x: 0, y: 0 });
    };
    if (menuImpresion.abierto) {
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [menuImpresion.abierto]);

const imprimirFactura = () => {
  const contenido = document.getElementById("contenido-impresion").innerHTML;

  // Crear iframe oculto
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  // Escribir contenido dentro del iframe
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Factura</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          @page {size: A4; margin: 20mm; }
        </style>
      </head>
      <body>
        ${contenido}
      </body>
    </html>
  `);
  doc.close();

  // Imprimir desde el iframe
  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // Limpiar el iframe después de un breve tiempo
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};


  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Listado de Ventas</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar Ventas, empleado, cliente..."
              value={filtro}
              onChange={handleFiltroChange}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Button className="gap-2" onClick={() => setMostrarNuevaFactura(true)}>
              <IoAddCircleOutline className="text-xl" />
              Nueva Factura
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N. Venta</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturasPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      No hay Venta para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  facturasPaginadas.map((factura) => (
                    <TableRow key={factura.idVenta}>
                      <TableCell>{factura.numeroVenta}</TableCell>
                      <TableCell>{factura.empleado}</TableCell>
                      <TableCell>{factura.cliente}</TableCell>
                      <TableCell>{factura.fecha}</TableCell>
                      <TableCell>C$ {factura.total.toFixed(2)}</TableCell>
                      <TableCell>{factura.estado}</TableCell>
                      <TableCell>{factura.sucursal}</TableCell>
                      <TableCell className="text-right space-x-2 relative">
                        <Button variant="outline" size="icon" onClick={() => confirmarAnulacion(factura)}>
                          <IoTrashOutline />
                        </Button>
                        {/* <Button variant="outline" size="icon" onClick={() => pagarFactura(factura)}>
                          <IoCheckmarkCircleOutline />
                        </Button> */}
                        <Button variant="outline" size="icon" onClick={() => setVerFactura(factura)}>
                          <IoEyeOutline />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuImpresion({
                              abierto: true,
                              id: factura.idVenta,
                              x: rect.left,
                              y: rect.bottom + window.scrollY
                            });
                          }}
                        >
                          <IoPrintOutline />
                        </Button>
                        {/* Menú de impresión */}
                        {menuImpresion.abierto && menuImpresion.id === factura.idVenta && (
                          <div
                            className="absolute z-50 bg-white border rounded shadow-md py-1 w-40"
                            style={{
                              left: "auto",
                              right: 0,
                              top: "2.5rem"
                            }}
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleImprimir("térmica", factura)}
                            >
                              Imprimir térmica
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleImprimir("carta", factura)}
                            >
                              Imprimir carta
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={paginaActual === 1}
              onClick={() => handlePaginaChange(paginaActual - 1)}
            >
              Anterior
            </Button>
            {[...Array(totalPaginas)].map((_, idx) => (
              <Button
                key={idx}
                variant={paginaActual === idx + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePaginaChange(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={paginaActual === totalPaginas}
              onClick={() => handlePaginaChange(paginaActual + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}


        <Dialog open={mostrarDialogoAnular} onOpenChange={setMostrarDialogoAnular}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>¿Desea anular esta venta?</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              <p className="text-lg mb-4">
                Está a punto de anular la venta <strong>{facturaSeleccionada?.numeroVenta}</strong>. ¿Está seguro?
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setMostrarDialogoAnular(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAnularFactura} className="bg-red-500 text-white hover:bg-red-600">
                  Anular
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

<Dialog open={mostrarModalImprimirCarta} onOpenChange={setMostrarModalImprimirCarta}>
          <DialogContent className="max-w-[850px] p-0 max-h-[90vh] overflow-auto">
             <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg font-bold my-4">Vista previa - Formato Carta</h2>

      {facturaParaImprimir ? (
        <div id="area-impresion">
          <VentaCarta venta={facturaParaImprimir} modoImpresion={true} />
        </div>
      ) : (
        <p className="text-red-500">No se pudo cargar la venta.</p>
      )}

      <div className="flex gap-4 mt-4 mb-2">
        <Button variant="outline" onClick={() => setMostrarModalImprimirCarta(false)}>
          Cerrar
        </Button>
        <Button onClick={imprimirFactura} className="bg-green-700 text-white hover:bg-green-800">
          🖨️ Imprimir
        </Button>
      </div>
    </div>
          </DialogContent>
        </Dialog>
        <ModalNuevaFactura
          mostrarNuevaFactura={mostrarNuevaFactura}
          setMostrarNuevaFactura={setMostrarNuevaFactura}
          setFacturas={setFacturas}
          facturas={facturas} />



          {verFactura && (
          <ModalVerFactura factura={verFactura} setMostrarFactura={setVerFactura}/>
          )}

      </div>
    </Layout>
  );
};

export default Facturas;