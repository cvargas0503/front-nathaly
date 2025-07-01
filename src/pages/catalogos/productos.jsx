import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearProducto, editarProducto, eliminarProducto, obtenerProductos } from "../../services/productos";
import { IoCheckmarkCircle, IoAlertCircle, IoPencil } from "react-icons/io5";
import ModalProducto from "../../components/inventario/ModalProducto";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [editandoProducto, setEditandoProducto] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const PAGE_SIZE = 8;
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const res = await obtenerProductos(); // Debe retornar { data: [...], success: true }
            console.log(res.data)
            if (res.success) {
                setProductos(res.data);
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: "Error al cargar las productos.",
            });
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
                setTimeout(() => setAlert(null), 500);
            }, 3000);
        }
    };
    const filteredProductos = useMemo(() => {
        let filtered = productos;
        if (search) {
            filtered = filtered.filter((p) =>
                Object.values(p)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        
        return filtered;
    }, [productos, search, filters]);

    const paginatedProductos = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredProductos.slice(start, start + PAGE_SIZE);
    }, [filteredProductos, page]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (paginatedProductos.every((p) => selected.includes(p.idProducto))) {
            setSelected((prev) => prev.filter((id) => !paginatedProductos.some((p) => p.idProducto === id)));
        } else {
            setSelected((prev) => [
                ...prev,
                ...paginatedProductos.filter((p) => !prev.includes(p.idProducto)).map((p) => p.idProducto),
            ]);
        }
    };

    const handleDeleteSelected = async() => {
        if (selected.length === 0) return;
        setIsDeleting(true);

        try {
            const res = await eliminarProducto(selected);

            if (res.success) {
                // Eliminar del estado local
                setProductos((prev) => prev.filter((p) => !selected.includes(p.idProducto)));
                setAlert({ type: "success", message: "Productos eliminadas exitosamente." });
            } else {
                throw new Error("Error inesperado");
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: `Error al eliminar las productos. ${error.response?.data?.message || error.message}`,
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
    // const handleExportPDF = () => {
    //     alert("Funcionalidad de exportar a PDF pendiente de implementar.");
    // };


    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const totalPages = Math.ceil(filteredProductos.length / PAGE_SIZE);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [alertVisible, setAlertVisible] = useState(true); // 👈 nuevo estado


    const handleNuevo = () => {
        setAlert(null);
        setShowModal(true);
    };
    const handleEditarProducto = (producto) => {
        setEditandoProducto(producto);
        setAlert(null);
        setShowModal(true);
    };

const handleGuardarProducto = async (form) => {
    try {
        setIsLoading(true)
        if (editandoProducto) {
            const res = await editarProducto(editandoProducto.idProducto, form);
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "¡Producto editada exitosamente!",
                });

                setProductos((prev) =>
                    prev.map((p) =>
                        p.idProducto === editandoProducto.idProducto ? { ...p, ...res.data } : p
                    )
                );
                setShowModal(false);
                setEditandoProducto(null);
            } else {
                setAlert({
                    type: "error",
                    message: "Ocurrió un error al editar la producto.",
                });
            }
        } else {
            const res = await crearProducto(form);
            if (res.success) {
                setAlert({
                    type: "success",
                    message: "¡Producto guardada exitosamente!",
                });
                console.log(res.data)
                console.log(productos)
                setProductos((prev) => [
                    ...prev,
                    res.data
                ]);
                setShowModal(false);
            } else {
                setAlert({
                    type: "error",
                    message: "Ocurrió un error al guardar la producto.",
                });
            }
        }
    } catch (error) {
        console.log(error)
        setAlert({
            type: "error",
            message: `Ocurrió un error al guardar la producto. ${
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
                <ModalProducto onClose={() => {setShowModal(false);setEditandoProducto(null);}} show={showModal} onSave={handleGuardarProducto} isLoading={isLoading} productoEditar={editandoProducto}/>
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
                        placeholder="Buscar producto..."
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
                                            paginatedProductos.length > 0 &&
                                            paginatedProductos.every((p) => selected.includes(p.idProducto))
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                                                <th className="px-3 py-2 text-left">Imagen</th>
                                <th className="px-3 py-2 text-left">Código
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.codigo || ""}
                                            onChange={(e) => handleFilterChange("codigo", e.target.value)}
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
                                <th className="px-3 py-2 text-left">Referencia
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.referencia || ""}
                                            onChange={(e) => handleFilterChange("referencia", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Descripcion
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.descripcion || ""}
                                            onChange={(e) => handleFilterChange("descripcion", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Categoria
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.categoria || ""}
                                            onChange={(e) => handleFilterChange("categoria", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Marca
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.marca || ""}
                                            onChange={(e) => handleFilterChange("marca", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">Linea
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.linea || ""}
                                            onChange={(e) => handleFilterChange("linea", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                 <th className="px-3 py-2 text-left">Proveedor
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.proveedor || ""}
                                            onChange={(e) => handleFilterChange("proveedor", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                 <th className="px-3 py-2 text-left">Existencia Mínima
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.existenciaMin || ""}
                                            onChange={(e) => handleFilterChange("existenciaMin", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                 <th className="px-3 py-2 text-left">Existencia Máxima
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.existenciaMax || ""}
                                            onChange={(e) => handleFilterChange("existenciaMax", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                 <th className="px-3 py-2 text-left">Costo
                                    <div>
                                        {/* <input
                                            className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-sm"
                                            placeholder="Filtrar"
                                            value={filters.costo || ""}
                                            onChange={(e) => handleFilterChange("costo", e.target.value)}
                                        /> */}
                                    </div>
                                </th>
                                <th className="px-3 py-2 text-left">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedProductos.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        No hay productos para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProductos.map((p) => (
                                    <tr
                                        key={p.idProducto}
                                        className={
                                            selected.includes(p.idProducto)
                                                ? "bg-indigo-50"
                                                : "hover:bg-gray-50 transition"
                                        }
                                    >
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.idProducto)}
                                                onChange={() => toggleSelect(p.idProducto)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            {p.imagen ? (
                                                <img
                                                src={`http://localhost:3000${p.imagen}`}
                                                alt="Producto"
                                                className="w-16 h-16 object-cover rounded shadow border"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300 rounded">
                                                Sin imagen
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2">{p.codigo}</td>
                                        <td className="px-3 py-2">{p.referencia}</td>
                                        <td className="px-3 py-2">{p.descripcion}</td>
                                        <td className="px-3 py-2">{p.categoria}</td>
                                        <td className="px-3 py-2">{p.marca}</td>
                                        <td className="px-3 py-2">{p.linea}</td>
                                        <td className="px-3 py-2">{p.proveedor}</td>
                                        <td className="px-3 py-2">{p.existenciaMin}</td>
                                        <td className="px-3 py-2">{p.existenciaMax}</td>
                                        <td className="px-3 py-2">{p.costo}</td>

                                        <td className="px-3 py-2">
                                            <button
                                                className="text-indigo-600 hover:underline font-semibold cursor-pointer" 
                                                onClick={() => handleEditarProducto(p)}
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
                        Mostrando {filteredProductos.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
                        {Math.min(page * PAGE_SIZE, filteredProductos.length)} de {filteredProductos.length} Productos
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