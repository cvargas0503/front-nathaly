import React from "react";
import html2pdf from "html2pdf.js";

export default function VentaTermica({ venta }) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = document.getElementById("reporte-venta");
    const opt = {
      margin: 0.2,
      filename: `venta_${venta.numero}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a5", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* CONTENIDO DEL TICKET */}
        <div
          id="reporte-venta"
          className="w-[300px] bg-white p-4 text-sm font-mono shadow-xl border border-gray-400 rounded-lg"
        >
          <h2 className="text-center font-bold text-base">TIENDA NATHALY</h2>
          <p className="text-center text-xs mb-2">Factura N° {venta.numero}</p>
          <p className="text-[11px]">Fecha: {venta.fecha}</p>
          <p className="text-[11px]">Cliente: {venta.cliente}</p>
          {venta.metodoPago && (
            <p className="text-[11px]">Pago: {venta.metodoPago}</p>
          )}

          <hr className="my-2 border-gray-400" />

          {venta.detalles.map((item, index) => (
            <div key={index} className="flex justify-between text-[11px]">
              <span>{item.descripcion}</span>
              <span>
                {item.cantidad} x {item.precio}
              </span>
            </div>
          ))}

          <hr className="my-2 border-gray-400" />

          <div className="flex justify-between text-[12px] font-bold">
            <span>Total:</span>
            <span>C$ {venta.total}</span>
          </div>

          {venta.observacion && (
            <p className="text-[11px] mt-2">Nota: {venta.observacion}</p>
          )}

          <p className="text-center mt-3 text-[11px]">¡Gracias por su compra!</p>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-black text-black-400 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-500 hover:text-black transition duration-200"
          >
            🖨️ Imprimir
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-black-400 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition duration-200"
          >
            📄 Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
