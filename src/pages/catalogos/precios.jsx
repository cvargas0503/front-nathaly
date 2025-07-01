import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearPrecio, editarPrecio, eliminarPrecio, obtenerPrecios } from "../../services/precios";
import { IoCheckmarkCircle, IoAlertCircle, IoPencil } from "react-icons/io5";

export default function Precios() {
    const [precios, setPrecios] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [editandoPrecio, setEditandoPrecio] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errores, setErrores] = useState({});
    
    const PAGE_SIZE = 8;
  
    useEffect(() => {
        fetchPrecios();
    }, []);

    const fetchPrecios = async () => {
        try {
            const res = await obtenerPrecios(); // Debe retornar { data: [...], success: true }
            if (res.success) {
                console.log("Precios obtenidas:", res.data);
                setPrecios(res.data);
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: "Error al cargar las precios.",
            });
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
                setTimeout(() => setAlert(null), 500);
            }, 3000);
        }
    };
    const filteredPrecios = useMemo(() => {
        let filtered = precios;
        if (search) {
            filtered = filtered.filter((p) =>
                Object.values(p)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        
        return filtered;
    }, [precios, search, filters]);

    const paginatedPrecios = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredPrecios.slice(start, start + PAGE_SIZE);
    }, [filteredPrecios, page]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (paginatedPrecios.every((p) => selected.includes(p.idListaPrecio))) {
            setSelected((prev) => prev.filter((id) => !paginatedPrecios.some((p) => p.idListaPrecio === id)));
        } else {
            setSelected((prev) => [
                ...prev,
                ...paginatedPrecios.filter((p) => !prev.includes(p.idListaPrecio)).map((p) => p.idListaPrecio),
            ]);
        }
    };

    const handleDeleteSelected = async() => {
        if (selected.length === 0) return;
        setIsDeleting(true);

        try {
            const res = await eliminarPrecio(selected);

            if (res.success) {
                // Eliminar del estado local
                setPrecios((prev) => prev.filter((p) => !selected.includes(p.idListaPrecio)));
                setAlert({ type: "success", message: "Precios eliminadas exitosamente." });
            } else {
                throw new Error("Error inesperado");
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: `Error al eliminar las precios. ${error.response?.data?.message || error.message}`,
            });
        } finally {
            setSelected([]);
            setIsDeleting(false);
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
                setTimeout(() => setAlert(null), 500);
            }, 3000);
        }
    };
    const handleExportPDF = () => {
        alert("Funcionalidad de exportar a PDF pendiente de implementar.");
    };


    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const totalPages = Math.ceil(filteredPrecios.length / PAGE_SIZE);

    const [showModal, setShowModal] = useState(false);
    const [formPrecio, setFormPrecio] = useState({
        nombre: "",
        descripcion: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [alertVisible, setAlertVisible] = useState(true); // 👈 nuevo estado


    const handleNuevo = () => {
        setShowModal(true);
        setFormPrecio({
            nombre: "",
            descripcion: ""
        });
        setErrores({});
        setAlert(null);
    };
    const handleEditarPrecio = (precio) => {
        setEditandoPrecio(precio);
        setFormPrecio(precio);
        setErrores({});
        setShowModal(true);
        setAlert(null);
    };

const handleGuardarPrecio = async () => {
    try {
        const camposRequeridos = {
            nombre: "El nombre del precio es requerido.",
            descripcion: "La descripción del precio es obligatoria.",
        };

        const nuevosErrores = {};
        Object.entries(camposRequeridos).forEach(([key, mensaje]) => {
            if (!formPrecio[key].trim()) {
                nuevosErrores[key] = mensaje;
            }
        });

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            setAlert({ type: "error", message: "Por favor, completa los campos obligatorios." });
            return;
        }

        setErrores({});


        setIsLoading(true);
        setAlert(null);

        if (editandoPrecio) {
            // Editar precio existente
            console.log(editandoPrecio)
            const res = await editarPrecio(editandoPrecio.idListaPrecio, formPrecio);
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "¡Precio editada exitosamente!",
                });

                setPrecios((prev) =>
                    prev.map((p) =>
                        p.idListaPrecio === editandoPrecio.idListaPrecio ?  res.data : p
                    )
                );

                setShowModal(false);
                setEditandoPrecio(null);
            } else {
                setAlert({
                    type: "error",
                    message: "Ocurrió un error al editar la precio.",
                });
            }
        } else {
            // Crear nueva precio
            const res = await crearPrecio(formPrecio);
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "¡Precio guardada exitosamente!",
                });

                setPrecios((prev) => [
                    ...prev,
                    res.data
                ]);

                setShowModal(false);
            } else {
                setAlert({
                    type: "error",
                    message: "Ocurrió un error al guardar la precio.",
                });
            }
        }
    } catch (error) {
        setAlert({
            type: "error",
            message: `Ocurrió un error al guardar la precio. ${
                error.response?.data?.message || error.message
            }`,
        });
    } finally {
        setIsLoading(false);
        setAlertVisible(true);

        setTimeout(() => {
            setAlertVisible(false);
            setTimeout(() => setAlert(null), 500);
        }, 3000);
    }
};


    return (
        <Layout usuario={"juan"}>
            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
                {/* Alert */}
               {alert && (
                    <div
                        className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-lg transition-all duration-500 ease-in-out
                            ${alertVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                            ${alert.type === "success"
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                    >
                        {alert.type === "success" ? (
                            <span className="text-2xl"><IoCheckmarkCircle /></span>
                        ) : (
                            <span className="text-2xl"><IoAlertCircle /></span>
                        )}
                        {alert.message}
                    </div>
                )}


                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                                onClick={() => { setShowModal(false); setAlert(null); }}
                                disabled={isLoading}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-indigo-700">{editandoPrecio ? "Editar Precio" : "Agregar Nueva Precio"}</h2>
                           <div className="space-y-3 pb-6">
                               {[
                                    { label: "Nombre", key: "nombre" },
                                    { label: "Descripción", key: "descripcion" },
                                ].map(({ label, key }) => (
                                    <div key={key}>
                                        <label className="block mb-1 text-gray-700 font-medium">
                                            {label}
                                            {["nombre", "descripcion"].includes(key) && (
                                                <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                                                errores[key]
                                                    ? "border-red-400 focus:ring-red-300"
                                                    : "border-gray-300 focus:ring-indigo-400"
                                            }`}
                                            value={formPrecio[key]}
                                            onChange={(e) =>
                                                setFormPrecio({ ...formPrecio, [key]: e.target.value })
                                            }
                                            disabled={isLoading}
                                        />
                                        {errores[key] && (
                                            <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                                {errores[key]}
                                            </p>
                                        )}
                                    </div>
                                ))}

                            </div>
                            {/* {alert && alert.type === "error" && (
                                <div className="mb-3 text-red-600 animate-shake">{alert.message}</div>
                            )} */}
                            <button
                                onClick={handleGuardarPrecio}
                                disabled={isLoading}
                                className={`w-full py-2 rounded-lg font-semibold text-lg shadow transition
                                    bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                                    hover:from-indigo-600 hover:to-purple-600
                                    active:scale-95
                                    ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
                                `}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Guardando...
                                    </span>
                                ) : (
                                    "Guardar"
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Resto del contenido */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={handleNuevo}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded shadow hover:from-indigo-700 hover:to-purple-700 transition"
                        >
                            <span className="mr-2">+</span>
                            Nuevo
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded shadow hover:from-pink-600 hover:to-red-600 transition"
                        >
                            <span className="mr-2">📄</span>
                            Exportar a PDF
                        </button>
                        {selected.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                disabled={isDeleting}
                                className={`bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-2 rounded shadow hover:from-red-700 hover:to-red-500 transition flex items-center gap-2 ${
                                    isDeleting ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>Eliminar seleccionados ({selected.length})</>
                                )}
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar precio..."
                        className="w-full md:w-72 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="overflow-x-auto rounded-lg shadow bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                            <tr>
                                <th className="px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        checked={
                                            paginatedPrecios.length > 0 &&
                                            paginatedPrecios.every((p) => selected.includes(p.idListaPrecio))
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left">Nombre
                                    <div>
                                        <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.nombre || ""}
                                            onChange={(e) => handleFilterChange("nombre", e.target.value)}
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Descripcion
                                    <div>
                                        <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.descripcion || ""}
                                            onChange={(e) => handleFilterChange("descripcion", e.target.value)}
                                        />
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedPrecios.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        No hay precios para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                paginatedPrecios.map((p) => (
                                    <tr
                                        key={p.idListaPrecio}
                                        className={
                                            selected.includes(p.idListaPrecio)
                                                ? "bg-indigo-50"
                                                : "hover:bg-gray-50 transition"
                                        }
                                    >
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.idListaPrecio)}
                                                onChange={() => toggleSelect(p.idListaPrecio)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">{p.nombre}</td>
                                        <td className="px-3 py-2">{p.descripcion}</td>
                                        <td className="px-3 py-2">
                                            <button
                                                className="text-indigo-600 hover:underline font-semibold cursor-pointer" 
                                                onClick={() => handleEditarPrecio(p)}
                                            >
                                                <IoPencil className="inline-block mr-1" />
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
                    <div className="text-gray-600 text-sm">
                        Mostrando {filteredPrecios.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
                        {Math.min(page * PAGE_SIZE, filteredPrecios.length)} de {filteredPrecios.length} Precios
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 rounded ${
                                    page === i + 1
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                                }`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}