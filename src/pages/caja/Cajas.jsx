import React, { useState } from "react";
import Layout from "../../components/general/layout";

// Ejemplo de sucursales (puedes reemplazarlo por datos reales)
const branches = [
    { id: 1, name: "Sucursal Centro" },
    { id: 2, name: "Sucursal Norte" },
    { id: 3, name: "Sucursal Sur" },
];

// Datos de ejemplo para cajas
const initialCajas = [
    { id: 1, nombre: "Caja Principal", sucursal: "Sucursal Centro" },
    { id: 2, nombre: "Caja Secundaria", sucursal: "Sucursal Norte" },
    { id: 3, nombre: "Caja Express", sucursal: "Sucursal Sur" },
];

const Cajas = () => {
    const [cajas, setCajas] = useState(initialCajas);
    const [filterNombre, setFilterNombre] = useState("");
    const [filterSucursal, setFilterSucursal] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("create"); // "create" | "edit"
    const [form, setForm] = useState({ id: null, nombre: "", sucursal: "" });
    const [confirmDelete, setConfirmDelete] = useState({ visible: false, caja: null });

    // Filtrado de cajas
    const filteredCajas = cajas.filter(
        (caja) =>
            caja.nombre.toLowerCase().includes(filterNombre.toLowerCase()) &&
            (filterSucursal === "" || caja.sucursal === filterSucursal)
    );

    // Manejo de formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Crear o editar caja
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.nombre || !form.sucursal) return;
        if (modalType === "create") {
            setCajas([
                ...cajas,
                {
                    id: Date.now(),
                    nombre: form.nombre,
                    sucursal: form.sucursal,
                },
            ]);
        } else {
            setCajas(
                cajas.map((caja) =>
                    caja.id === form.id
                        ? { ...caja, nombre: form.nombre, sucursal: form.sucursal }
                        : caja
                )
            );
        }
        setShowModal(false);
        setForm({ id: null, nombre: "", sucursal: "" });
    };

    // Abrir modal de creación/edición
    const openModal = (type, caja = null) => {
        setModalType(type);
        if (type === "edit" && caja) {
            setForm({ id: caja.id, nombre: caja.nombre, sucursal: caja.sucursal });
        } else {
            setForm({ id: null, nombre: "", sucursal: "" });
        }
        setShowModal(true);
    };

    // Abrir confirmación de eliminación
    const handleDelete = (caja) => {
        setConfirmDelete({ visible: true, caja });
    };

    // Confirmar y borrar
    const confirmDeleteCaja = () => {
        setCajas(cajas.filter((c) => c.id !== confirmDelete.caja.id));
        setConfirmDelete({ visible: false, caja: null });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
                <div className="max-w-4xl mx-auto bg-white/80 rounded-3xl shadow-2xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">
                            Gestión de Cajas
                        </h1>
                        <button
                            onClick={() => openModal("create")}
                            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                        >
                            + Nueva Caja
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Filtrar por nombre..."
                            value={filterNombre}
                            onChange={(e) => setFilterNombre(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                        <select
                            value={filterSucursal}
                            onChange={(e) => setFilterSucursal(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
                        >
                            <option value="">Todas las sucursales</option>
                            {branches.map((s) => (
                                <option key={s.id} value={s.name}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl shadow-md">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200">
                                    <th className="py-3 px-4 text-left font-bold text-purple-700">Nombre</th>
                                    <th className="py-3 px-4 text-left font-bold text-purple-700">Sucursal</th>
                                    <th className="py-3 px-4 text-center font-bold text-purple-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCajas.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-400">
                                            No hay cajas que coincidan con el filtro.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCajas.map((caja) => (
                                        <tr key={caja.id} className="hover:bg-purple-50 transition-colors">
                                            <td className="py-3 px-4">{caja.nombre}</td>
                                            <td className="py-3 px-4">{caja.sucursal}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => openModal("edit", caja)}
                                                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full mr-2 transition-colors shadow"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(caja)}
                                                    className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full transition-colors shadow"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de creación/edición */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold text-purple-700 mb-6">
                                {modalType === "create" ? "Crear Nueva Caja" : "Editar Caja"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-purple-600 font-semibold mb-1">
                                        Nombre de la Caja
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-600 font-semibold mb-1">
                                        Sucursal
                                    </label>
                                    <select
                                        name="sucursal"
                                        value={form.sucursal}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
                                        required
                                    >
                                        <option value="">Selecciona una sucursal</option>
                                        {branches.map((s) => (
                                            <option key={s.id} value={s.name}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        {modalType === "create" ? "Crear" : "Guardar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación de Eliminación */}
                {confirmDelete.visible && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl"
                                onClick={() => setConfirmDelete({ visible: false, caja: null })}
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold text-purple-700 mb-4">
                                Confirmar eliminación
                            </h2>
                            <p className="mb-6 text-gray-600">
                                ¿Estás seguro de eliminar <span className="font-semibold">{confirmDelete.caja.nombre}</span>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirmDelete({ visible: false, caja: null })}
                                    className="px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteCaja}
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Animación para el modal */}
                <style>{`
                    .animate-fade-in {
                        animation: fadeIn 0.25s ease;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95);} 
                        to { opacity: 1; transform: scale(1);} 
                    }
                `}</style>
            </div>
        </Layout>
    );
};

export default Cajas;