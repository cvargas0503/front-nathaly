import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


import * as XLSX from "xlsx";

import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { obtenerKardexGeneral } from "../../services/kardex";
import KardexDetallado from "../../components/inventario/KardexDetallado";

export default function Kardex() {
  const [referenciaFiltro, setReferenciaFiltro] = useState("");
  const [bodegaFiltro, setBodegaFiltro] = useState("Todas las Bodegas");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [kardex, setKardex] = useState([]);

  const bodegas = ["Todas las Bodegas", ...Array.from(new Set(kardex.map((p) => p.bodega)))];


  useEffect(() => {
    fetchKardex();
  }, [])

  const fetchKardex = async () => {
    try
    {
      const response = await obtenerKardexGeneral()
      if (!response.success) {
        throw new Error("Error al obtener el kardex");
      }

      setKardex(response.data.kardex);
    } catch (error) {
      console.error("Error fetching kardex:", error);
      toast.error("Error al obtener el kardex. Por favor, inténtelo de nuevo más tarde.");
      setKardex([]);
    }

  }
  const verDetalle = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const kardexFiltrado = kardex.filter((p) => {
    const coincideReferencia = p.referencia.toLowerCase().includes(referenciaFiltro.toLowerCase());
    const coincideCodigo = p.codigo.toLowerCase().includes(referenciaFiltro.toLowerCase());
    const coincideDescripcion = p.descripcion.toLowerCase().includes(referenciaFiltro.toLowerCase());
    const coincideBodega = bodegaFiltro === "Todas las Bodegas" || p.bodega === bodegaFiltro;
    return (coincideReferencia || coincideCodigo || coincideDescripcion) && coincideBodega;
  });

  return (
    <Layout>
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Kardex por Bodega</h1>

      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por referencia..."
          value={referenciaFiltro}
          onChange={(e) => setReferenciaFiltro(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-2xl shadow-sm w-full sm:w-64 focus:outline-none focus:ring focus:border-blue-300"
        />
        <select
          value={bodegaFiltro}
          onChange={(e) => setBodegaFiltro(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-2xl shadow-sm w-full sm:w-64 focus:outline-none focus:ring focus:border-blue-300"
        >
          {bodegas.map((bodega, i) => (
            <option key={i} value={bodega}>
              {bodega}
            </option>
          ))}
        </select>
      </div>

      <Card className="rounded-2xl shadow-lg p-4 overflow-x-auto">
        <table className="w-full text-sm text-center text-gray-800">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3">Código</th>
              <th className="py-3">Referencia</th>
              <th className="py-3">Descripción</th>
              <th className="py-3">Categoría</th>
              <th className="py-3">Marca</th>
              <th className="py-3">Línea</th>
              <th className="py-3">Bodega</th>
              <th className="py-3">Entradas</th>
              <th className="py-3">Salidas</th>
              <th className="py-3">Saldo</th>
              <th className="py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {kardexFiltrado.map((p, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="py-3">{p.codigo}</td>
                <td className="py-3">{p.referencia}</td>
                <td className="py-3">{p.descripcion}</td>
                <td className="py-3">{p.categoria}</td>
                <td className="py-3">{p.marca}</td>
                <td className="py-3">{p.linea}</td>
                <td className="py-3">{p.bodega}</td>
                <td className="py-3 text-green-600 font-semibold">{p.entradas}</td>
                <td className="py-3 text-red-600 font-semibold">{p.salidas}</td>
                <td className="py-3 font-bold">{p.saldo}</td>
                <td className="py-3">
                  <Button
                    onClick={() => verDetalle(p)}
                    className="px-3 py-1 rounded-2xl text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ver Detalle
                  </Button>
                </td>
              </tr>
            ))}
            {kardexFiltrado.length === 0 && (
              <tr>
                <td colSpan={11} className="py-6 italic text-gray-400">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {mostrarModal && productoSeleccionado && (
        <KardexDetallado productoSeleccionado={productoSeleccionado}  setMostrarModal={setMostrarModal}/>
      )}
    </div>
    </Layout>
  );
}
