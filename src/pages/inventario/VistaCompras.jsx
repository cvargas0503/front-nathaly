// Vista de compras generales - VerCompras.jsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { ObtenerCompras } from "../../services/compras";
export default function VerCompras() {
  const [compras, setCompras] = useState([]);
  const [expandida, setExpandida] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const comprasPorPagina = 7;

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const res = await ObtenerCompras();
      if (res.success) {
        setCompras(res.data);
      } else {
        toast.error("Error al cargar las compras.");
      }
    } catch {
      toast.error("Error al cargar las compras.");
    }
  };

  // Filtrado
  const comprasFiltradas = compras.filter(
    (compra) =>
      compra.numero.toString().includes(filtro) ||
      compra.proveedor?.toLowerCase().includes(filtro.toLowerCase()) ||
      compra.bodegaDestino?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Paginación
  const indiceUltimaCompra = paginaActual * comprasPorPagina;
  const indicePrimeraCompra = indiceUltimaCompra - comprasPorPagina;
  const comprasPaginadas = comprasFiltradas.slice(indicePrimeraCompra, indiceUltimaCompra);
  const totalPaginas = Math.ceil(comprasFiltradas.length / comprasPorPagina);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setPaginaActual(1);
  };

  const handlePaginaChange = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };



  const calcularTotal = (productos) => {
    return productos.reduce((total, p) => total + p.cantidad * p.costoUnit, 0);
  };



  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Listado de Compras</h1>

        <div className="flex w-full mb-4">
          <input
            type="text"
            placeholder="Buscar por número, proveedor o destino..."
            value={filtro}
            onChange={handleFiltroChange}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {comprasPaginadas.map((compra, idx) => (
          <Card key={idx} className="p-6 rounded-3xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">Compra: {compra.numero}</p>
                <p className="text-sm text-gray-500">Fecha: {compra.fecha}</p>
                <p className="text-sm text-gray-500">Proveedor: {compra.proveedor}</p>
                <p className="text-sm text-gray-500">Destino: {compra.bodegaDestino}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  Total: C$ {calcularTotal(compra.detalles).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  className="bg-blue-600 text-white px-3 py-1 rounded-xl text-sm"
                  onClick={() => setExpandida(expandida === idx ? null : idx)}
                >
                  {expandida === idx ? "Ocultar Detalle" : "Ver Detalle"}
                </Button>
              </div>
            </div>

            {expandida === idx && (
              <table className="w-full text-sm text-center border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2">Código</th>
                    <th className="py-2">Referencia</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Costo</th>
                    <th className="py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {compra.detalles.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2">{p.codigo}</td>
                      <td className="py-2">{p.referencia}</td>
                      <td className="py-2">{p.descripcion}</td>
                      <td className="py-2">{p.cantidad}</td>
                      <td className="py-2">C$ {p.costoUnit}</td>
                      <td className="py-2">C$ {(p.costoUnit * p.cantidad).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        ))}

        {/* Paginación */}
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
      </div>
    </Layout>
  );
}
