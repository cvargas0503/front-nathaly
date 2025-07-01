import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearEmpleado, editarEmpleado, eliminarEmpleado, obtenerEmpleados } from "../../services/empleados";
import { IoCheckmarkCircle, IoAlertCircle, IoPencil } from "react-icons/io5";
import ModalEmpleado from "../../components/catalogos/ModalEmpleado";
import { toast } from "react-toastify";

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [editandoEmpleado, setEditandoEmpleado] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const PAGE_SIZE = 8;

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            const res = await obtenerEmpleados(); // Debe retornar { data: [...], success: true }
            if (res.success) {
                setEmpleados(res.data);
            }
        } catch (error) {
            console.log(error)
            setAlert({
                type: "error",
                message: "Error al cargar las empleados.",
            });
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
                setTimeout(() => setAlert(null), 500);
            }, 3000);
        }
    };
    const filteredEmpleados = useMemo(() => {
        let filtered = empleados;
        if (search) {
            filtered = filtered.filter((p) =>
                Object.values(p)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        return filtered;
    }, [empleados, search, filters]);

    const paginatedEmpleados = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredEmpleados.slice(start, start + PAGE_SIZE);
    }, [filteredEmpleados, page]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (paginatedEmpleados.every((p) => selected.includes(p.idEmpleado))) {
            setSelected((prev) => prev.filter((id) => !paginatedEmpleados.some((p) => p.idEmpleado === id)));
        } else {
            setSelected((prev) => [
                ...prev,
                ...paginatedEmpleados.filter((p) => !prev.includes(p.idEmpleado)).map((p) => p.idEmpleado),
            ]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selected.length === 0) return;
        setIsDeleting(true);

        try {
            const res = await eliminarEmpleado(selected);

            if (res.success) {
                // Eliminar del estado local
                setEmpleados((prev) => prev.filter((p) => !selected.includes(p.idEmpleado)));
                setAlert({ type: "success", message: "Empleados eliminadas exitosamente." });
            } else {
                throw new Error("Error inesperado");
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: `Error al eliminar las empleados. ${error.response?.data?.message || error.message}`,
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

    const totalPages = Math.ceil(filteredEmpleados.length / PAGE_SIZE);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [alertVisible, setAlertVisible] = useState(true); // 👈 nuevo estado


    const handleNuevo = () => {
        setAlert(null);
        setShowModal(true);
    };
    const handleEditarEmpleado = (empleado) => {
        setEditandoEmpleado(empleado);
        setAlert(null);
        setShowModal(true);
    };

    const handleGuardarEmpleado = async (form) => {
        try {
            setIsLoading(true)
            if (editandoEmpleado) {
                const res = await editarEmpleado(editandoEmpleado.idEmpleado, form);
                console.log(res)
                console.log(editandoEmpleado)
                console.log("Hola")
                console.log(
                    empleados.filter((p) =>
                        p.idEmpleado === editandoEmpleado.idEmpleado ? { ...p, ...res.data } : p
                    ))
                if (res.success) {
                    setAlert({
                        type: "success",
                        message: "¡Empleado editada exitosamente!",
                    });

                    setEmpleados((prev) =>
                        prev.map((p) =>
                            p.idEmpleado === editandoEmpleado.idEmpleado ? { ...p, ...res.data } : p
                        )
                    );
                    setShowModal(false);
                    setEditandoEmpleado(null);
                } else {
                    setAlert({
                        type: "error",
                        message: "Ocurrió un error al editar la empleado.",
                    });
                }
            } else {
                const res = await crearEmpleado(form);
                if (res.success) {
                    setAlert({
                        type: "success",
                        message: "¡Empleado guardada exitosamente!",
                    });
                    console.log(res.data)
                    console.log(empleados)
                    setEmpleados((prev) => [
                        ...prev,
                        res.data
                    ]);
                    setShowModal(false);
                } else {
                    setAlert({
                        type: "error",
                        message: "Ocurrió un error al guardar la empleado.",
                    });
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(`Error al guardar la empleado: ${error.response?.data?.message || error.message}`);
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
                <ModalEmpleado onClose={() => { setShowModal(false); setEditandoEmpleado(null); }} show={showModal} onSave={handleGuardarEmpleado} isLoading={isLoading} empleadoEditar={editandoEmpleado} />
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
                            <span className="mr-2">📄</span>
                            Exportar a PDF
                        </button>
                        {selected.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                disabled={isDeleting}
                                className={`bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-2 rounded shadow hover:from-red-700 hover:to-red-500 transition flex items-center gap-2 ${isDeleting ? "opacity-70 cursor-not-allowed" : ""
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
                        placeholder="Buscar empleado..."
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
                                            paginatedEmpleados.length > 0 &&
                                            paginatedEmpleados.every((p) => selected.includes(p.idEmpleado))
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
                                <th className="px-3 py-2 text-left">Puesto
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.puesto || ""}
                                            onChange={(e) => handleFilterChange("puesto", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedEmpleados.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        No hay empleados para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                paginatedEmpleados.map((p) => (
                                    <tr
                                        key={p.idEmpleado}
                                        className={
                                            selected.includes(p.idEmpleado)
                                                ? "bg-indigo-50"
                                                : "hover:bg-gray-50 transition"
                                        }
                                    >
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.idEmpleado)}
                                                onChange={() => toggleSelect(p.idEmpleado)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">{p.nombres} {' '} {p.apellidos}</td>
                                        <td className="px-3 py-2">{p.numDoc}</td>
                                        <td className="px-3 py-2">{p.direccion}</td>
                                        <td className="px-3 py-2">{p.celular}</td>
                                        <td className="px-3 py-2">{p.sucursal}</td>
                                        <td className="px-3 py-2">{p.puesto}</td>
                                        <td className="px-3 py-2">
                                            <button
                                                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                                                onClick={() => handleEditarEmpleado(p)}
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
                        Mostrando {filteredEmpleados.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
                        {Math.min(page * PAGE_SIZE, filteredEmpleados.length)} de {filteredEmpleados.length} Empleados
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
                                className={`px-3 py-1 rounded ${page === i + 1
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