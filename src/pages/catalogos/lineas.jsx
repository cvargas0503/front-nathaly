import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearLinea, editarLinea, eliminarLinea, obtenerLineas } from "../../services/lineas";
import { PageShell, Pagination, EmptyState, TableLoader, SimpleModal, FormInput, PrimaryButton, EditButton } from "../../components/general/PageComponents";
import { HiOutlineNewspaper } from "react-icons/hi";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

export default function Lineas() {
    const [lineas, setLineas] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editandoLinea, setEditandoLinea] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newLineaName, setNewLineaName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { fetchLineas(); }, []);

    const fetchLineas = async () => {
        try {
            setLoading(true);
            const res = await obtenerLineas();
            if (res.success) setLineas(res.data);
        } catch {
            toast.error("Error al cargar las líneas.");
        } finally {
            setLoading(false);
        }
    };

    const filteredLineas = useMemo(() => {
        if (!search) return lineas;
        return lineas.filter((p) =>
            Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase())
        );
    }, [lineas, search]);

    const paginatedLineas = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredLineas.slice(start, start + PAGE_SIZE);
    }, [filteredLineas, page]);

    const toggleSelect = (id) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const toggleSelectAll = () => {
        if (paginatedLineas.every((p) => selected.includes(p.idLinea))) {
            setSelected((prev) => prev.filter((id) => !paginatedLineas.some((p) => p.idLinea === id)));
        } else {
            setSelected((prev) => [...prev, ...paginatedLineas.filter((p) => !prev.includes(p.idLinea)).map((p) => p.idLinea)]);
        }
    };

    const handleDeleteSelected = async () => {
        if (!selected.length) return;
        setIsDeleting(true);
        try {
            const res = await eliminarLinea(selected);
            if (res.success) {
                setLineas((prev) => prev.filter((p) => !selected.includes(p.idLinea)));
                toast.success("Líneas eliminadas exitosamente.");
                setSelected([]);
            } else throw new Error();
        } catch (error) {
            toast.error(`Error al eliminar: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNuevo = () => { setEditandoLinea(null); setNewLineaName(""); setShowModal(true); };
    const handleEditar = (l) => { setEditandoLinea(l); setNewLineaName(l.nombre); setShowModal(true); };

    const handleGuardar = async () => {
        if (!newLineaName.trim()) { toast.error("El nombre es requerido."); return; }
        setIsLoading(true);
        try {
            if (editandoLinea) {
                const res = await editarLinea(editandoLinea.idLinea, { nombre: newLineaName });
                if (res.success) {
                    setLineas((prev) => prev.map((p) => p.idLinea === editandoLinea.idLinea ? { ...p, nombre: res.data.nombre } : p));
                    toast.success("Línea editada exitosamente.");
                    setShowModal(false);
                } else toast.error("Error al editar la línea.");
            } else {
                const res = await crearLinea({ nombre: newLineaName });
                if (res.success) {
                    setLineas((prev) => [...prev, { idLinea: res.data.idLinea, nombre: res.data.nombre }]);
                    toast.success("Línea creada exitosamente.");
                    setShowModal(false);
                } else toast.error("Error al crear la línea.");
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredLineas.length / PAGE_SIZE);
    const allSelected = paginatedLineas.length > 0 && paginatedLineas.every((p) => selected.includes(p.idLinea));

    return (
        <Layout>
            <PageShell
                search={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Buscar línea..."
                onNew={handleNuevo}
                newLabel="Nueva Línea"
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
                                <tr><td colSpan={3}><TableLoader /></td></tr>
                            ) : paginatedLineas.length === 0 ? (
                                <tr><td colSpan={3}><EmptyState icon={HiOutlineNewspaper} message="No hay líneas registradas." filtered={!!search} /></td></tr>
                            ) : paginatedLineas.map((p) => (
                                <tr key={p.idLinea} style={{ background: selected.includes(p.idLinea) ? "rgba(30,58,95,0.04)" : undefined }}>
                                    <td><input type="checkbox" checked={selected.includes(p.idLinea)} onChange={() => toggleSelect(p.idLinea)} className="rounded" /></td>
                                    <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>{p.nombre}</td>
                                    <td className="text-right"><EditButton onClick={() => handleEditar(p)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalPages={totalPages} totalItems={filteredLineas.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </PageShell>

            <SimpleModal open={showModal} onClose={() => { setShowModal(false); setEditandoLinea(null); }} title={editandoLinea ? "Editar Línea" : "Nueva Línea"}>
                <div className="space-y-4">
                    <FormInput label="Nombre de la línea" id="nombre-linea" type="text" placeholder="Ej: Línea Premium" value={newLineaName}
                        onChange={(e) => setNewLineaName(e.target.value)} disabled={isLoading} autoFocus onKeyDown={(e) => e.key === "Enter" && handleGuardar()} />
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => { setShowModal(false); setEditandoLinea(null); }}
                            className="px-4 py-2 rounded-xl text-sm font-medium border"
                            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }} disabled={isLoading}>
                            Cancelar
                        </button>
                        <PrimaryButton onClick={handleGuardar} loading={isLoading}>Guardar Línea</PrimaryButton>
                    </div>
                </div>
            </SimpleModal>
        </Layout>
    );
}
