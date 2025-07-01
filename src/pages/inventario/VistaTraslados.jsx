import React, { useEffect, useState } from "react";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { ObtenerTraslados } from "../../services/traslados";

// // Simulated API data
// const mockTraslados = [
//     {
//         id: 1,
//         NumeroTraslado: "TR-001",
//         FechaTraslado: "2024-06-01",
//         BodegaOrigen: "Central",
//         BodegaDestino: "Sucursal Norte",
//         Observacion: "Traslado urgente",
//         productos: [
//             { codigo: "P001", referencia: "REF-01", descripcion: "Producto A", cantidad: 10 },
//             { codigo: "P002", referencia: "REF-02", descripcion: "Producto B", cantidad: 5 },
//         ],
//     },
//     {
//         id: 2,
//         NumeroTraslado: "TR-002",
//         FechaTraslado: "2024-06-10",
//         BodegaOrigen: "Sucursal Sur",
//         BodegaDestino: "Central",
//         Observacion: "Reposición",
//         productos: [
//             { codigo: "P003", referencia: "REF-03", descripcion: "Producto C", cantidad: 8 },
//         ],
//     },
//     // ...más traslados
// ];

function filtrarTraslados(traslados, { fechaInicio, fechaFin, busqueda }) {
    return traslados.filter((t) => {
        const fecha = new Date(t.FechaTraslado);
        const cumpleFecha =
            (!fechaInicio || fecha >= new Date(fechaInicio)) &&
            (!fechaFin || fecha <= new Date(fechaFin));
        const texto = `${t.numeroTraslado} ${t.bodegaOrigen} ${t.bodegaDestino} ${t.observacion}`.toLowerCase();
        const cumpleBusqueda = texto.includes(busqueda.toLowerCase());
        return cumpleFecha && cumpleBusqueda;
    });
}

export default function VistaTraslados() {
    const [traslados, setTraslados] = useState([]);
    const [filtros, setFiltros] = useState({
        fechaInicio: "",
        fechaFin: "",
        busqueda: "",
    });
    const [trasladosFiltrados, setTrasladosFiltrados] = useState([]);
    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        fetchTraslados();
    }, []);

    const fetchTraslados = async () => {
        try
        {
            const res = await ObtenerTraslados();
            console.log("Traslados obtenidos:", res);
            if (res.success) {
                setTraslados(res.data);
            } else {
                toast.error("Error al cargar los traslados.");
                setTraslados([]);
            }
        }
        catch (error) {
            console.error("Error fetching traslados:", error);
            toast.error("Error al cargar los traslados. Por favor, inténtelo de nuevo más tarde.");
            setTraslados([]);
        }
    }

    useEffect(() => {
        setTrasladosFiltrados(filtrarTraslados(traslados, filtros));
    }, [traslados, filtros]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Traslados de Inventario</h1>
                {/* Filtros */}
                <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={filtros.fechaInicio}
                            onChange={handleFiltroChange}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                        <input
                            type="date"
                            name="fechaFin"
                            value={filtros.fechaFin}
                            onChange={handleFiltroChange}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar traslado</label>
                        <input
                            type="text"
                            name="busqueda"
                            value={filtros.busqueda}
                            onChange={handleFiltroChange}
                            placeholder="Número, bodega, observación..."
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                </div>
                {/* Tabla de traslados */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">N° Traslado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Bodega Origen</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Bodega Destino</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Observación</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {trasladosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">
                                        No se encontraron traslados.
                                    </td>
                                </tr>
                            ) : (
                                trasladosFiltrados.map((t) => (
                                    <tr key={t.idTraslado} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 font-medium">{t.numeroTraslado}</td>
                                        <td className="px-4 py-3">{t.fechaTraslado}</td>
                                        <td className="px-4 py-3">{t.bodegaOrigen}</td>
                                        <td className="px-4 py-3">{t.bodegaDestino}</td>
                                        <td className="px-4 py-3">{t.observacion}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setDetalle(t)}
                                                className="text-blue-600 hover:underline font-semibold"
                                            >
                                                Ver detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Modal de detalles */}
                {detalle && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                                onClick={() => setDetalle(null)}
                                aria-label="Cerrar"
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Detalles del traslado {detalle.NumeroTraslado}
                            </h2>
                            <div className="mb-4 text-sm text-gray-600">
                                <div><span className="font-semibold">Fecha:</span> {detalle.fechaTraslado}</div>
                                <div><span className="font-semibold">Origen:</span> {detalle.bodegaOrigen}</div>
                                <div><span className="font-semibold">Destino:</span> {detalle.bodegaDestino}</div>
                                <div><span className="font-semibold">Observación:</span> {detalle.observacion}</div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-gray-700">Productos trasladados</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold">Código</th>
                                                <th className="px-3 py-2 text-left font-semibold">Referencia</th>
                                                <th className="px-3 py-2 text-left font-semibold">Descripción</th>
                                                <th className="px-3 py-2 text-left font-semibold">Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detalle.detalles.map((p, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-2">{p.codigo}</td>
                                                    <td className="px-3 py-2">{p.referencia}</td>
                                                    <td className="px-3 py-2">{p.descripcion}</td>
                                                    <td className="px-3 py-2">{p.cantidad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setDetalle(null)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </Layout>
    );
}