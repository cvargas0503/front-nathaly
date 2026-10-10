import React from "react";

export default function VentaTermica({ venta, modoPreview = false }) {
  if (!venta || typeof venta !== "object") {
    return <p className="text-red-500">Datos de la venta no disponibles.</p>;
  }

  // Map fields - the component supports both field naming conventions
  const numero = venta.numeroVenta || venta.numero || "N/A";
  const fecha = venta.fecha || "N/A";
  const cliente = venta.cliente || "N/A";
  const empleado = venta.empleado || "";
  const metodoPago = venta.metodoPago || venta.termino || "";
  const observacion = venta.observacion || "";
  const detalles = Array.isArray(venta.detalles) ? venta.detalles : [];
  const total = venta.total != null ? Number(venta.total).toFixed(2) : "0.00";

  const ticketContent = (
    <div
      style={{
        width: "280px",
        background: "white",
        padding: "16px",
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        border: modoPreview ? "1px dashed #bbb" : "none",
        borderRadius: modoPreview ? "8px" : "0",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          margin: "0 0 4px 0",
        }}
      >
        TIENDA NATHALY
      </h2>
      <p style={{ textAlign: "center", fontSize: "11px", margin: "0 0 8px 0" }}>
        Factura N° {numero}
      </p>
      <p style={{ fontSize: "11px", margin: "2px 0" }}>Fecha: {fecha}</p>
      <p style={{ fontSize: "11px", margin: "2px 0" }}>Cliente: {cliente}</p>
      {empleado && (
        <p style={{ fontSize: "11px", margin: "2px 0" }}>Vendedor: {empleado}</p>
      )}
      {metodoPago && (
        <p style={{ fontSize: "11px", margin: "2px 0" }}>Pago: {metodoPago}</p>
      )}

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "8px 0" }} />

      {detalles.map((item, index) => (
        <div
          key={index}
          className="detalle-item"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            marginBottom: "2px",
          }}
        >
          <span style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.descripcion || item.referencia || "Producto"}
          </span>
          <span>
            {item.cantidad} x C${(item.precioUnitario || item.precio || 0).toFixed(2)}
          </span>
        </div>
      ))}

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "8px 0" }} />

      <div
        className="total"
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        <span>Total:</span>
        <span>C$ {total}</span>
      </div>

      {observacion && (
        <p style={{ fontSize: "11px", marginTop: "8px" }}>Nota: {observacion}</p>
      )}

      <p
        className="footer"
        style={{ textAlign: "center", marginTop: "12px", fontSize: "11px" }}
      >
        ¡Gracias por su compra!
      </p>
    </div>
  );

  // If in preview mode (embedded inside a Dialog), just render the ticket content
  if (modoPreview) {
    return ticketContent;
  }

  // Standalone page mode (legacy support)
  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div id="reporte-venta">{ticketContent}</div>

        <div className="flex gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-lg font-semibold shadow-md transition duration-200"
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #2a5298)",
              color: "white",
            }}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
