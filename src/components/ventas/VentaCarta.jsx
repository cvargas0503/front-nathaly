export default function VentaCarta({ venta, modoImpresion = false }) {
  if (!venta || typeof venta !== "object") {
    return <p className="text-red-500">Datos de la venta no disponibles.</p>;
  }



  return (
    <div className={`w-full ${modoImpresion ? "" : "p-6 bg-gray-100 flex justify-center"}`}>
      <div id="contenido-impresion" className="bg-white w-full max-w-[794px] p-10 text-sm border border-gray-300">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWvyF_uxSEAVK2aCOEjFuU9QYhAdczXMaZOg&s" alt="Logo" className="h-20" />
          <div className="text-right">
            <h1 className="text-xl font-bold">Tienda Nathaly</h1>
            <p>Mercado Oriental, Managua, Nicaragua</p>
            <p>Tel: +505 8888 9999</p>
          </div>
        </div>

        {/* Datos de la Factura */}
        <div className="grid grid-cols-2 mb-6">
          <div>
            <p><strong>Factura N°:</strong> {venta.numeroVenta || "N/A"}</p>
            <p><strong>Fecha:</strong> {venta.fecha || "N/A"}</p>
          </div>
          <div>
            <p><strong>Cliente:</strong> {venta.cliente || "N/A"}</p>
            <p><strong>Dirección:</strong> {venta.direccion || "S/N"}</p>
          </div>
        </div>

        {/* Detalles de Productos */}
        <table className="w-full border text-sm mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Producto</th>
              <th className="border p-2 text-center">Cantidad</th>
              <th className="border p-2 text-center">Precio</th>
              <th className="border p-2 text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(venta.detalles) && venta.detalles.length > 0 ? (
              venta.detalles.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{item.descripcion}</td>
                  <td className="border p-2 text-center">{item.cantidad}</td>
                  <td className="border p-2 text-center">C$ {item.precioUnitario?.toFixed(2)}</td>
                  <td className="border p-2 text-center">C$ {(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">Sin productos.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end mb-4">
          <div className="w-1/3 text-right">
            <p><strong>Total:</strong> C$ {venta.total?.toFixed(2) || "0.00"}</p>
          </div>
        </div>

        {/* Observaciones */}
        {venta.observacion && (
          <p className="italic text-sm mb-6">Nota: {venta.observacion}</p>
        )}

        <p className="text-center">¡Gracias por su preferencia!</p>

        {/* Firmas */}
        <div className="flex justify-between mt-10">
          <div className="text-center w-1/3">
            <hr className="border-t mb-1" />
            <p className="text-xs">Firma Cliente</p>
          </div>
          <div className="text-center w-1/3">
            <hr className="border-t mb-1" />
            <p className="text-xs">Firma Vendedor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
