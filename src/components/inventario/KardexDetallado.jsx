import { useEffect, useState } from "react";
import { obtenerMovimientosPorProducto } from "../../services/kardex";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const KardexDetallado = ({productoSeleccionado, setMostrarModal}) => {
    const [movimientos, setMovimientos] = useState([]);
    useEffect(() => {
        if (productoSeleccionado) {
            fetchMovimientos();
        }
    }, [productoSeleccionado]);

    console.log("Producto seleccionado:", productoSeleccionado);

    const fetchMovimientos = async () => {
        try {
            const response = await obtenerMovimientosPorProducto(productoSeleccionado.idProducto, productoSeleccionado.idBodega);
            console.log("Movimientos:", response);
            if (response.success) {
                setMovimientos(response.data.movimientos);
            } else {
                toast.error("Error al obtener los movimientos del producto.");
            }
        } catch (error) {
            console.error("Error fetching movimientos:", error);
            toast.error("Error al obtener los movimientos del producto. Por favor, inténtelo de nuevo más tarde.");
        }
    }
    const exportarPDF = (descargar = true) => {
  if (!productoSeleccionado) return;

  const doc = new jsPDF();
  console.log("Movimientos para PDF:", movimientos);

  // Determinar logo según bodega o sucursal
  let logoSrc = "";
  const nombre = productoSeleccionado.bodega.toLowerCase();

  if (nombre.includes("nathaly")) logoSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWvyF_uxSEAVK2aCOEjFuU9QYhAdczXMaZOg&s";
  else if (nombre.includes("m&m") || nombre.includes("my&m")) logoSrc = "/src/assets/img/TMM.jpg";
  else if (nombre.includes("isabella")) logoSrc = "/src/assets/img/TI.jpg";
  else logoSrc = "../src/assets/react.svg";


  const logo = new Image();
  logo.src = logoSrc;

  console.log("Logo source:", logoSrc);
  logo.onload = () => {
    doc.addImage(logo, "JPEG", 10, 10, 30, 30); // x, y, width, height

    doc.setFontSize(16);
    doc.text("Reporte de Movimientos Kardex", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text("DIR:", 105, 23, { align: "center" });

    // Información del encabezado
    doc.setFontSize(10);
    doc.text(`BODEGA: ${productoSeleccionado.bodega}`, 105, 35, { align: "center" });

    doc.text(`REFERENCIA: ${productoSeleccionado.referencia}`, 14, 45);
    doc.text(`DESCRIPCIÓN PRODUCTO: ${productoSeleccionado.descripcion}`, 105, 45, { align: "center" });
    doc.text(`CODIGO: ${productoSeleccionado.codigo}`, 200, 45, { align: "right" });


    // doc.text(`CATEGORIA: ${productoSeleccionado.categoria}`, 14, 57);
    // doc.text(`LINEA: ${productoSeleccionado.linea}`, 105, 57);
    let saldoAcumulado = 0;
  // Tabla de movimientos con columna de documento
    autoTable(doc, {
      startY: 60,
      head: [["Fecha", "Concepto", "Documento", "Entrada", "Salida", "Saldo"]],
      body: movimientos.map((m) => {
         const entrada = m.cantidad > 0 ? m.cantidad : 0;
         const salida = m.cantidad < 0 ? Math.abs(m.cantidad) : 0;

                                // Acumulando el saldo
        saldoAcumulado += m.cantidad;
        return[
        m.fecha,
        m.tipoMovimiento,
        m.observacion,
        entrada,
        salida,
        saldoAcumulado,
      ]}),
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3, halign: 'center' },
      headStyles: { fillColor: [41, 128, 185], halign: 'center' },
    });
 if (descargar) {
      doc.save(`Kardex_${productoSeleccionado.referencia}.pdf`);
    } else {
      const blob = doc.output("bloburl");
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = blob;
        document.body.appendChild(iframe);
        iframe.onload = function () {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };
}  };
};

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(movimientos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "detalle-kardex.xlsx");
  };
  let saldoAcumulado = 0;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    Detalle de movimientos - Código: {productoSeleccionado.codigo} / Ref: {productoSeleccionado.referencia}
                </h2>

                <div id="reporte-detalle">
                    <table className="w-full text-sm text-center border border-gray-200 mb-4">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-2 px-2">Fecha</th>
                                <th className="py-2 px-2">Concepto</th>
                                <th className="py-2 px-2">Documento</th>
                                <th className="py-2 px-2">Entrada</th>
                                <th className="py-2 px-2">Salida</th>
                                <th className="py-2 px-2">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.map((m, idx) => {
                                const entrada = m.cantidad > 0 ? m.cantidad : 0;
                                const salida = m.cantidad < 0 ? Math.abs(m.cantidad) : 0;

                                // Acumulando el saldo
                                saldoAcumulado += m.cantidad;
                                return (
                                <tr key={idx} className="border-t">
                                    <td className="py-2">{m.fecha}</td>
                                    <td className="py-2">{m.tipoMovimiento}</td>
                                    <td className="py-2">{m.observacion}</td>
                                    <td className="py-2 text-green-600">{entrada}</td>
                                    <td className="py-2 text-red-600">{salida}</td>
                                    <td className="py-2 font-bold">{saldoAcumulado}</td>
                                </tr>
                                )
}   )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between gap-2 flex-wrap">
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-xl" onClick={() => exportarPDF(false)}>
                        Imprimir
                    </Button>
                    <Button className="bg-red-600 text-white px-4 py-2 rounded-xl" onClick={exportarPDF}>
                        Exportar a PDF
                    </Button>
                    <Button className="bg-green-600 text-white px-4 py-2 rounded-xl" onClick={exportarExcel}>
                        Exportar a Excel
                    </Button>
                    <Button className="bg-gray-600 text-white px-4 py-2 rounded-xl ml-auto" onClick={() => setMostrarModal(false)}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default KardexDetallado
