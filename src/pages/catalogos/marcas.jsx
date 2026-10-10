import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearMarca, editarMarca, eliminarMarca, obtenerMarcas } from "../../services/marcas";
import { PageShell, Pagination, EmptyState, TableLoader, SimpleModal, FormInput, PrimaryButton, EditButton } from "../../components/general/PageComponents";
import { HiOutlineTag } from "react-icons/hi";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

export default function Marcas() {
    const [marcas, setMarcas] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editandoMarca, setEditandoMarca] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newMarcaName, setNewMarcaName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { fetchMarcas(); }, []);

    const fetchMarcas = async () => {
        try {
            setLoading(true);
            const res = await obtenerMarcas();
            if (res.success) setMarcas(res.data);
        } catch {
            toast.error("Error al cargar las marcas.");
        } finally {
            setLoading(false);
        }
    };

    const filteredMarcas = useMemo(() => {
        if (!search) return marcas;
        return marcas.filter((p) =>
            Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase())
        );
    }, [marcas, search]);

    const paginatedMarcas = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredMarcas.slice(start, start + PAGE_SIZE);
    }, [filteredMarcas, page]);

    const toggleSelect = (id) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const toggleSelectAll = () => {
        if (paginatedMarcas.every((p) => selected.includes(p.idMarca))) {
            setSelected((prev) => prev.filter((id) => !paginatedMarcas.some((p) => p.idMarca === id)));
        } else {
            setSelected((prev) => [...prev, ...paginatedMarcas.filter((p) => !prev.includes(p.idMarca)).map((p) => p.idMarca)]);
        }
    };

    const handleDeleteSelected = async () => {
        if (!selected.length) return;
        setIsDeleting(true);
        try {
            const res = await eliminarMarca(selected);
            if (res.success) {
                setMarcas((prev) => prev.filter((p) => !selected.includes(p.idMarca)));
                toast.success("Marcas eliminadas exitosamente.");
                setSelected([]);
            } else throw new Error();
        } catch (error) {
            toast.error(`Error al eliminar: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNuevo = () => { setEditandoMarca(null); setNewMarcaName(""); setShowModal(true); };
    const handleEditar = (m) => { setEditandoMarca(m); setNewMarcaName(m.nombre); setShowModal(true); };

    const handleGuardar = async () => {
        if (!newMarcaName.trim()) { toast.error("El nombre es requerido."); return; }
        setIsLoading(true);
        try {
            if (editandoMarca) {
                const res = await editarMarca(editandoMarca.idMarca, { nombre: newMarcaName });
                if (res.success) {
                    setMarcas((prev) => prev.map((p) => p.idMarca === editandoMarca.idMarca ? { ...p, nombre: res.data.nombre } : p));
                    toast.success("Marca editada exitosamente.");
                    setShowModal(false);
                } else toast.error("Error al editar la marca.");
            } else {
                const res = await crearMarca({ nombre: newMarcaName });
                if (res.success) {
                    setMarcas((prev) => [...prev, { idMarca: res.data.idMarca, nombre: res.data.nombre }]);
                    toast.success("Marca creada exitosamente.");
                    setShowModal(false);
                } else toast.error("Error al crear la marca.");
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredMarcas.length / PAGE_SIZE);
    const allSelected = paginatedMarcas.length > 0 && paginatedMarcas.every((p) => selected.includes(p.idMarca));

    return (
        <Layout>
            <PageShell
                search={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Buscar marca..."
                onNew={handleNuevo}
                newLabel="Nueva Marca"
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
                            ) : paginatedMarcas.length === 0 ? (
                                <tr><td colSpan={3}><EmptyState icon={HiOutlineTag} message="No hay marcas registradas." filtered={!!search} /></td></tr>
                            ) : paginatedMarcas.map((p) => (
                                <tr key={p.idMarca} style={{ background: selected.includes(p.idMarca) ? "rgba(30,58,95,0.04)" : undefined }}>
                                    <td><input type="checkbox" checked={selected.includes(p.idMarca)} onChange={() => toggleSelect(p.idMarca)} className="rounded" /></td>
                                    <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>{p.nombre}</td>
                                    <td className="text-right"><EditButton onClick={() => handleEditar(p)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalPages={totalPages} totalItems={filteredMarcas.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </PageShell>

            <SimpleModal open={showModal} onClose={() => { setShowModal(false); setEditandoMarca(null); }} title={editandoMarca ? "Editar Marca" : "Nueva Marca"}>
                <div className="space-y-4">
                    <FormInput label="Nombre de la marca" id="nombre-marca" type="text" placeholder="Ej: Samsung" value={newMarcaName}
                        onChange={(e) => setNewMarcaName(e.target.value)} disabled={isLoading} autoFocus onKeyDown={(e) => e.key === "Enter" && handleGuardar()} />
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => { setShowModal(false); setEditandoMarca(null); }}
                            className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }} disabled={isLoading}>
                            Cancelar
                        </button>
                        <PrimaryButton onClick={handleGuardar} loading={isLoading}>Guardar Marca</PrimaryButton>
                    </div>
                </div>
            </SimpleModal>
        </Layout>
    );
}
