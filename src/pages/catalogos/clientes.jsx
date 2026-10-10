import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearCliente, editarCliente, eliminarCliente, obtenerClientes } from "../../services/clientes";
import { IoCheckmarkCircle, IoAlertCircle, IoPencil } from "react-icons/io5";
import ModalCliente from "../../components/catalogos/ModalCliente";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [filters] = useState({});
    const [page, setPage] = useState(1);
    const [editandoCliente, setEditandoCliente] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const PAGE_SIZE = 8;

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const res = await obtenerClientes(); // Debe retornar { data: [...], success: true }
            if (res.success) {
                setClientes(res.data);
            }
        } catch {
            setAlert({
                type: "error",
                message: "Error al cargar las clientes.",
            });
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
                setTimeout(() => setAlert(null), 500);
            }, 3000);
        }
    };
    const filteredClientes = useMemo(() => {
        let filtered = clientes;
        if (search) {
            filtered = filtered.filter((p) =>
                Object.values(p)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        return filtered;
    }, [clientes, search, filters]);

    const paginatedClientes = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredClientes.slice(start, start + PAGE_SIZE);
    }, [filteredClientes, page]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (paginatedClientes.every((p) => selected.includes(p.idCliente))) {
            setSelected((prev) => prev.filter((id) => !paginatedClientes.some((p) => p.idCliente === id)));
        } else {
            setSelected((prev) => [
                ...prev,
                ...paginatedClientes.filter((p) => !prev.includes(p.idCliente)).map((p) => p.idCliente),
            ]);
        }
    };

    const handleDeleteSelected = async() => {
        if (selected.length === 0) return;
        setIsDeleting(true);

        try {
            const res = await eliminarCliente(selected);

            if (res.success) {
                // Eliminar del estado local
                setClientes((prev) => prev.filter((p) => !selected.includes(p.idCliente)));
                setAlert({ type: "success", message: "Clientes eliminadas exitosamente." });
            } else {
                throw new Error("Error inesperado");
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: `Error al eliminar las clientes. ${error.response?.data?.message || error.message}`,
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




    const totalPages = Math.ceil(filteredClientes.length / PAGE_SIZE);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [alertVisible, setAlertVisible] = useState(true); // Ã°Å¸â€˜Ë† nuevo estado


    const handleNuevo = () => {
        setAlert(null);
        setShowModal(true);
    };
    const handleEditarCliente = (cliente) => {
        setEditandoCliente(cliente);
        setAlert(null);
        setShowModal(true);
    };

const handleGuardarCliente = async (form) => {
    try {
        setIsLoading(true)
        if (editandoCliente) {
            const res = await editarCliente(editandoCliente.idCliente, form);
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "Ã‚Â¡Cliente editada exitosamente!",
                });

                setClientes((prev) =>
                    prev.map((p) =>
                        p.idCliente === editandoCliente.idCliente ? { ...p, ...res.data } : p
                    )
                );
                setShowModal(false);
                setEditandoCliente(null);
            } else {
                setAlert({
                    type: "error",
                    message: "OcurriÃƒÂ³ un error al editar la cliente.",
                });
            }
        } else {
            const res = await crearCliente(form);
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "Ã‚Â¡Cliente guardada exitosamente!",
                });
                console.log(res.data)
                console.log(clientes)
                setClientes((prev) => [
                    ...prev,
                    res.data
                ]);
                setShowModal(false);
            } else {
                setAlert({
                    type: "error",
                    message: "OcurriÃƒÂ³ un error al guardar la cliente.",
                });
            }
        }
    } catch (error) {
        console.log(error)
        setAlert({
            type: "error",
            message: `OcurriÃƒÂ³ un error al guardar la cliente. ${
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

                {/* {showModal && ( */}
                <ModalCliente onClose={() => {setShowModal(false);setEditandoCliente(null);}} show={showModal} onSave={handleGuardarCliente} isLoading={isLoading} clienteEditar={editandoCliente}/>
                {/* )} */}

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
                            <span className="mr-2">Ã°Å¸â€œâ€ž</span>
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
                        placeholder="Buscar cliente..."
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
                                            paginatedClientes.length > 0 &&
                                            paginatedClientes.every((p) => selected.includes(p.idCliente))
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left">Nombre completo
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.nombreCompleto || ""}
                                            onChange={(e) => handleFilterChange("nombreCompleto", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                {/* <th className="px-3 py-2 text-left">Apellidos
                                    <div>
                                        <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.apellidos || ""}
                                            onChange={(e) => handleFilterChange("apellidos", e.target.value)}
                                        />
                                    </div>
                                </th> */}
                                <th className="px-3 py-2 text-left">Identificacion
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.numDoc || ""}
                                            onChange={(e) => handleFilterChange("numDoc", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Direccion
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.direccion || ""}
                                            onChange={(e) => handleFilterChange("direccion", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Celular
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.celular || ""}
                                            onChange={(e) => handleFilterChange("celular", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Sucursal
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.sucursal || ""}
                                            onChange={(e) => handleFilterChange("sucursal", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Ã‚Â¿CrÃƒÂ©dito?
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.tieneCredito || ""}
                                            onChange={(e) => handleFilterChange("tieneCredito", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedClientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        No hay clientes para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                paginatedClientes.map((p) => (
                                    <tr
                                        key={p.idCliente}
                                        className={
                                            selected.includes(p.idCliente)
                                                ? "bg-indigo-50"
                                                : "hover:bg-gray-50 transition"
                                        }
                                    >
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.idCliente)}
                                                onChange={() => toggleSelect(p.idCliente)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">{p.nombres} {' '} {p.apellidos}</td>
                                        <td className="px-3 py-2">{p.numDoc}</td>
                                        <td className="px-3 py-2">{p.direccion}</td>
                                        <td className="px-3 py-2">{p.celular}</td>
                                        <td className="px-3 py-2">{p.sucursal}</td>
                                        <td className="px-3 py-2">{p.tieneCredito ? "SI" : "NO"}</td>
                                        <td className="px-3 py-2">
                                            <button
                                                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                                                onClick={() => handleEditarCliente(p)}
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
                {/* PaginaciÃƒÂ³n */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
                    <div className="text-gray-600 text-sm">
                        Mostrando {filteredClientes.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
                        {Math.min(page * PAGE_SIZE, filteredClientes.length)} de {filteredClientes.length} Clientes
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
