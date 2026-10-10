import { uploadUrl } from '../../lib/apiConfig';
import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/general/layout";
import { crearProducto, editarProducto, eliminarProducto, obtenerProductos } from "../../services/productos";
import ModalProducto from "../../components/inventario/ModalProducto";
import { PageShell, Pagination, EmptyState, TableLoader, EditButton } from "../../components/general/PageComponents";
import { HiOutlineCube } from "react-icons/hi";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editandoProducto, setEditandoProducto] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { fetchProductos(); }, []);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const res = await obtenerProductos();
            if (res.success) setProductos(res.data);
        } catch {
            toast.error("Error al cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProductos = useMemo(() => {
        if (!search) return productos;
        return productos.filter((p) =>
            Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase())
        );
    }, [productos, search]);

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

    const handleDeleteSelected = async () => {
        if (selected.length === 0) return;
        setIsDeleting(true);
        try {
            const res = await eliminarProducto(selected);
            if (res.success) {
                setProductos((prev) => prev.filter((p) => !selected.includes(p.idProducto)));
                toast.success("Productos eliminados exitosamente.");
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
        setEditandoProducto(null);
        setShowModal(true);
    };

    const handleEditarProducto = (producto) => {
        setEditandoProducto(producto);
        setShowModal(true);
    };

    const handleGuardarProducto = async (form) => {
        try {
            setIsLoading(true);
            if (editandoProducto) {
                const res = await editarProducto(editandoProducto.idProducto, form);
                if (res.success) {
                    setProductos((prev) =>
                        prev.map((p) => p.idProducto === editandoProducto.idProducto ? { ...p, ...res.data } : p)
                    );
                    toast.success("Producto editado exitosamente.");
                    setShowModal(false);
                    setEditandoProducto(null);
                } else {
                    toast.error("Error al editar el producto.");
                }
            } else {
                const res = await crearProducto(form);
                if (res.success) {
                    setProductos((prev) => [...prev, res.data]);
                    toast.success("Producto creado exitosamente.");
                    setShowModal(false);
                } else {
                    toast.error("Error al crear el producto.");
                }
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredProductos.length / PAGE_SIZE);
    const allSelected =
        paginatedProductos.length > 0 &&
        paginatedProductos.every((p) => selected.includes(p.idProducto));

    return (
        <Layout>
            <PageShell
                search={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Buscar producto..."
                onNew={handleNuevo}
                newLabel="Nuevo Producto"
                selectedCount={selected.length}
                onDeleteSelected={handleDeleteSelected}
                isDeleting={isDeleting}
            >
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="w-10">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        className="rounded"
                                    />
                                </th>
                                <th>Imagen</th>
                                <th>Código</th>
                                <th>Referencia</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Marca</th>
                                <th>Línea</th>
                                <th>Proveedor</th>
                                <th>Stock Mín.</th>
                                <th>Stock Máx.</th>
                                <th>Costo</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={13}>
                                        <TableLoader />
                                    </td>
                                </tr>
                            ) : paginatedProductos.length === 0 ? (
                                <tr>
                                    <td colSpan={13}>
                                        <EmptyState
                                            icon={HiOutlineCube}
                                            message="No hay productos registrados."
                                            filtered={!!search}
                                        />
                                    </td>
                                </tr>
                            ) : (
                                paginatedProductos.map((p) => (
                                    <tr
                                        key={p.idProducto}
                                        style={{
                                            background: selected.includes(p.idProducto)
                                                ? "rgba(30,58,95,0.04)"
                                                : undefined,
                                        }}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.idProducto)}
                                                onChange={() => toggleSelect(p.idProducto)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td>
                                            {p.imagen ? (
                                                <img
                                                    src={uploadUrl(p.imagen)}
                                                    alt="Producto"
                                                    className="w-12 h-12 object-cover rounded-lg border"
                                                    style={{ borderColor: "var(--color-border)" }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-12 h-12 flex items-center justify-center rounded-lg text-xs"
                                                    style={{
                                                        border: "1.5px dashed var(--color-border-strong)",
                                                        color: "var(--color-text-muted)",
                                                        background: "var(--color-surface-2)",
                                                    }}
                                                >
                                                    <HiOutlineCube className="w-5 h-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className="font-mono text-xs font-medium px-2 py-0.5 rounded"
                                                style={{ background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }}>
                                                {p.codigo}
                                            </span>
                                        </td>
                                        <td style={{ color: "var(--color-text-secondary)" }}>{p.referencia}</td>
                                        <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>{p.descripcion}</td>
                                        <td>
                                            <span className="badge badge-info">{p.categoria}</span>
                                        </td>
                                        <td style={{ color: "var(--color-text-secondary)" }}>{p.marca}</td>
                                        <td style={{ color: "var(--color-text-secondary)" }}>{p.linea}</td>
                                        <td style={{ color: "var(--color-text-secondary)" }}>{p.proveedor}</td>
                                        <td className="text-center">{p.existenciaMin}</td>
                                        <td className="text-center">{p.existenciaMax}</td>
                                        <td className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                            C$ {typeof p.costo === 'number' ? p.costo.toFixed(2) : p.costo}
                                        </td>
                                        <td className="text-right">
                                            <EditButton onClick={() => handleEditarProducto(p)} />
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
                    totalItems={filteredProductos.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                />
            </PageShell>

            <ModalProducto
                onClose={() => { setShowModal(false); setEditandoProducto(null); }}
                show={showModal}
                onSave={handleGuardarProducto}
                isLoading={isLoading}
                productoEditar={editandoProducto}
            />
        </Layout>
    );
}
