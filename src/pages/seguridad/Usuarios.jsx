import { useEffect, useState } from "react";
import Layout from "../../components/general/layout";
import ModalNuevoUsuario from "../../components/seguridad/ModalNuevoUsuario";
import { ModalEditarContra } from "../../components/seguridad/ModalEditarContra";
import { toast } from "react-toastify";
import { ObtenerUsuarios, deshabilitarUsuario as deshabilitarUsuarioAPI } from "../../services/usuarios";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [modal, setModal] = useState({
        nuevo: false,
        editar: null,
        deshabilitar: null
    });

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const res = await ObtenerUsuarios();
            if (!res.success) return toast.error("Error al obtener usuarios");
            setUsuarios(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al obtener usuarios");
        }
    };

    const abrirModal = (tipo, data = null) => {
        setModal((prev) => ({ ...prev, [tipo]: data || (tipo === "nuevo") }));
    };

    const cerrarModal = (tipo) => {
        setModal((prev) => ({ ...prev, [tipo]: tipo === "nuevo" ? false : null }));
    };

    const confirmarDeshabilitar = async () => {
        if (!modal.deshabilitar) return;
        try {
            const res = await deshabilitarUsuarioAPI(modal.deshabilitar.idUsuario);
            if (!res.success) return toast.error("Error al deshabilitar usuario");

            setUsuarios((prev) =>
                prev.map((u) =>
                    u.idUsuario === modal.deshabilitar.idUsuario ? { ...u, activo: false } : u
                )
            );
            cerrarModal("deshabilitar");
            toast.success("Usuario deshabilitado");
        } catch (err) {
            console.error(err);
            toast.error("Error al deshabilitar usuario");
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={() => abrirModal("nuevo")}
                    >
                        + Nuevo Usuario
                    </button>
                </div>

                <div className="overflow-x-auto rounded shadow">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-2 px-4 text-left">Empleado</th>
                                <th className="py-2 px-4 text-left">Usuario</th>
                                <th className="py-2 px-4 text-center">Estado</th>
                                <th className="py-2 px-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length ? usuarios.map((u) => (
                                <tr key={u.idUsuario} className={!u.activo ? "bg-gray-100 text-gray-400" : ""}>
                                    <td className="py-2 px-4">{u.nombreCompleto}</td>
                                    <td className="py-2 px-4">{u.usuario}</td>
                                    <td className="py-2 px-4 text-center">
                                        <span className={`inline-block px-2 py-1 rounded text-xs ${u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {u.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center space-x-2">
                                        <button className="text-blue-600 hover:underline" onClick={() => abrirModal("editar", u)}>
                                            Editar
                                        </button>
                                        {u.activo && (
                                            <button className="text-red-600 hover:underline" onClick={() => abrirModal("deshabilitar", u)}>
                                                Deshabilitar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400">No hay usuarios registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modales */}
                {modal.deshabilitar && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
                            <h2 className="text-xl font-semibold text-red-600 mb-2">¿Deshabilitar usuario?</h2>
                            <p className="text-gray-600 mb-6">
                                Esta acción desactivará el acceso de <b>{modal.deshabilitar.login}</b>.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" onClick={() => cerrarModal("deshabilitar")}>
                                    Cancelar
                                </button>
                                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={confirmarDeshabilitar}>
                                    Deshabilitar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modal.editar && (
                    <ModalEditarContra
                        setShowEditar={() => cerrarModal("editar")}
                        usuario={modal.editar}
                    />
                )}

                {modal.nuevo && (
                    <ModalNuevoUsuario
                        setShowNuevo={() => cerrarModal("nuevo")}
                        setUsuarios={setUsuarios}
                        usuarios={usuarios}
                    />
                )}
            </div>
        </Layout>
    );
}
