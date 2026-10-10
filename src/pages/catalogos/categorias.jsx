import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearCategoria, editarCategoria, eliminarCategoria, obtenerCategorias } from "../../services/categorias";
import { PageShell, Pagination, EmptyState, TableLoader, SimpleModal, FormInput, PrimaryButton, EditButton } from "../../components/general/PageComponents";
import { TbCategoryPlus } from "react-icons/tb";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editandoCategoria, setEditandoCategoria] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newCategoriaName, setNewCategoriaName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { fetchCategorias(); }, []);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const res = await obtenerCategorias();
            if (res.success) setCategorias(res.data);
        } catch {
            toast.error("Error al cargar las categorías.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCategorias = useMemo(() => {
        if (!search) return categorias;
        return categorias.filter((p) =>
            Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase())
        );
    }, [categorias, search]);

    const paginatedCategorias = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredCategorias.slice(start, start + PAGE_SIZE);
    }, [filteredCategorias, page]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (paginatedCategorias.every((p) => selected.includes(p.idCategoria))) {
            setSelected((prev) => prev.filter((id) => !paginatedCategorias.some((p) => p.idCategoria === id)));
        } else {
            setSelected((prev) => [
                ...prev,
                ...paginatedCategorias.filter((p) => !prev.includes(p.idCategoria)).map((p) => p.idCategoria),
            ]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selected.length === 0) return;
        setIsDeleting(true);
        try {
            const res = await eliminarCategoria(selected);
            if (res.success) {
                setCategorias((prev) => prev.filter((p) => !selected.includes(p.idCategoria)));
                toast.success("Categorías eliminadas exitosamente.");
                setSelected([]);
            } else {
                throw new Error("Error inesperado");
            }
        } catch (error) {
            toast.error(`Error al eliminar: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNuevo = () => {
        setEditandoCategoria(null);
        setNewCategoriaName("");
        setShowModal(true);
    };

    const handleEditarCategoria = (categoria) => {
        setEditandoCategoria(categoria);
        setNewCategoriaName(categoria.nombre);
        setShowModal(true);
    };

    const handleGuardarCategoria = async () => {
        if (!newCategoriaName.trim()) {
            toast.error("El nombre de la categoría es requerido.");
            return;
        }
        setIsLoading(true);
        try {
            if (editandoCategoria) {
                const res = await editarCategoria(editandoCategoria.idCategoria, { nombre: newCategoriaName });
                if (res.success) {
                    setCategorias((prev) =>
                        prev.map((p) =>
                            p.idCategoria === editandoCategoria.idCategoria
                                ? { ...p, nombre: res.data.nombre }
                                : p
                        )
                    );
                    toast.success("Categoría editada exitosamente.");
                    setShowModal(false);
                    setEditandoCategoria(null);
                } else {
                    toast.error("Error al editar la categoría.");
                }
            } else {
                const res = await crearCategoria({ nombre: newCategoriaName });
                if (res.success) {
                    setCategorias((prev) => [...prev, { idCategoria: res.data.idCategoria, nombre: res.data.nombre }]);
                    toast.success("Categoría creada exitosamente.");
                    setShowModal(false);
                } else {
                    toast.error("Error al crear la categoría.");
                }
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredCategorias.length / PAGE_SIZE);
    const allSelected =
        paginatedCategorias.length > 0 &&
        paginatedCategorias.every((p) => selected.includes(p.idCategoria));

    return (
        <Layout>
            <PageShell
                search={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Buscar categoría..."
                onNew={handleNuevo}
                newLabel="Nueva Categoría"
                selectedCount={selected.length}
                onDeleteSelected={handleDeleteSelected}
                isDeleting={isDeleting}
            >
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="w-10">
                                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="rounded" />
                                </th>
                                <th>Nombre</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3}><TableLoader /></td>
                                </tr>
                            ) : paginatedCategorias.length === 0 ? (
                                <tr>
                                    <td colSpan={3}>
                                        <EmptyState icon={TbCategoryPlus} message="No hay categorías registradas." filtered={!!search} />
                                    </td>
                                </tr>
                            ) : (
                                paginatedCategorias.map((p) => (
                                    <tr
                                        key={p.idCategoria}
                                        style={{ background: selected.includes(p.idCategoria) ? "rgba(30,58,95,0.04)" : undefined }}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.idCategoria)}
                                                onChange={() => toggleSelect(p.idCategoria)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>{p.nombre}</td>
                                        <td className="text-right">
                                            <EditButton onClick={() => handleEditarCategoria(p)} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={filteredCategorias.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                />
            </PageShell>

            {/* Modal */}
            <SimpleModal
                open={showModal}
                onClose={() => { setShowModal(false); setEditandoCategoria(null); }}
                title={editandoCategoria ? "Editar Categoría" : "Nueva Categoría"}
            >
                <div className="space-y-4">
                    <FormInput
                        label="Nombre de la categoría"
                        id="nombre-categoria"
                        type="text"
                        placeholder="Ej: Electrónica"
                        value={newCategoriaName}
                        onChange={(e) => setNewCategoriaName(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleGuardarCategoria()}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => { setShowModal(false); setEditandoCategoria(null); }}
                            className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <PrimaryButton onClick={handleGuardarCategoria} loading={isLoading}>
                            Guardar Categoría
                        </PrimaryButton>
                    </div>
                </div>
            </SimpleModal>
        </Layout>
    );
}
