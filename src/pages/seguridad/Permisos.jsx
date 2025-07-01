import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Layout from "../../components/general/layout";
import { asignarPermisosUsuario, obtenerPermisos, removerPermisosUsuario } from "../../services/permisos";
import { toast } from "react-toastify";

const mockEmployees = [
    { id: 7, name: "Juan Pérez" },
    { id: 2, name: "Ana Gómez" },
    { id: 3, name: "Carlos Ruiz" },
];

// const mockRoles = [
//   {
//     role: "Administrador",
//     permissions: [
//       { id: "admin-1", name: "Gestionar usuarios" },
//       { id: "admin-2", name: "Ver reportes" },
//     ],
//   },
//   {
//     role: "Editor",
//     permissions: [
//       { id: "editor-1", name: "Editar contenido" },
//       { id: "editor-2", name: "Publicar artículos" },
//     ],
//   },
//   {
//     role: "Lector",
//     permissions: [{ id: "lector-1", name: "Ver contenido" }],
//   },
// ];

export default function Permisos() {
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [unassigned, setUnassigned] = useState([]);
    const [assigned, setAssigned] = useState([]);
    const [selectedUnassigned, setSelectedUnassigned] = useState([]);
    const [selectedAssigned, setSelectedAssigned] = useState([]);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    useEffect(() => {
        if (selectedEmployee) {
            fetchPermisos(selectedEmployee);
        } else {
            resetState();
        }
    }, [selectedEmployee]);

    const fetchPermisos = async (idUsuario) => {
        try {
            const res = await obtenerPermisos(idUsuario);
            if (res.success) {
                const estructurar = (lista) => {
                    const agrupados = {};
                    lista.forEach((perm) => {
                        const categoria = categorizar(perm.nombre);
                        if (!agrupados[categoria]) agrupados[categoria] = [];
                        agrupados[categoria].push({ id: perm.idPermiso, name: perm.nombre });
                    });
                    return Object.entries(agrupados).map(([role, permissions]) => ({ role, permissions }));
                };

                setAssigned(estructurar(res.asignados));
                setUnassigned(estructurar(res.noAsignados));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const categorizar = (nombre) => {
        if (nombre.toLowerCase().includes("venta")) return "VENTAS";
        if (nombre.toLowerCase().includes("kardex") || nombre.toLowerCase().includes("traslado")) return "INVENTARIO";
        if (nombre.toLowerCase().includes("permiso") || nombre.toLowerCase().includes("usuario")) return "ADMINISTRACIÓN";
        if (nombre.toLowerCase().includes("producto") || nombre.toLowerCase().includes("cliente") || nombre.toLowerCase().includes("proveedor")) return "CATÁLOGOS";
        return "OTROS";
    };
    const toggleSelection = (key, selectedList, setSelected) => {
        setSelected((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const assignPermissions = async () => {
        if (!selectedEmployee || selectedUnassigned.length === 0) return;

        const permisosAsignar = selectedUnassigned.map((key) => {
            const [, permId] = key.split(":");
            return parseInt(permId);
        });

        try {
            const respuesta = await asignarPermisosUsuario({
                idEmpleado: selectedEmployee,
                permisos: permisosAsignar
            });

            if (!respuesta.success) {
                toast.error("Error al asignar los permisos.");
                return;
            }

            // Extraer permisos antes de modificar los arrays
            const toAssign = selectedUnassigned.map((key) => {
                const [roleName, permIdStr] = key.split(":");
                const permId = parseInt(permIdStr, 10);            // <-- convertir a número
                const role = unassigned.find((r) => r.role === roleName);
                const perm = role?.permissions.find((p) => p.id === permId); // ahora sí coincide
                return perm ? { roleName, perm } : null;
            }).filter(Boolean);


            const updatedUnassigned = unassigned.map((role) => ({
                ...role,
                permissions: role.permissions.filter(
                    (p) => !selectedUnassigned.includes(`${role.role}:${p.id}`)
                ),
            })).filter((role) => role.permissions.length > 0);

            const updatedAssigned = assigned.map((r) => ({
                ...r,
                permissions: [...r.permissions]
            }));

            toAssign.forEach(({ roleName, perm }) => {
                const assignedRole = updatedAssigned.find((r) => r.role === roleName);
                if (assignedRole) {
                    assignedRole.permissions = [...assignedRole.permissions, perm];
                } else {
                    updatedAssigned.push({ role: roleName, permissions: [perm] });
                }
            });

            setUnassigned([...updatedUnassigned]);
            setAssigned([...updatedAssigned]);
            setSelectedUnassigned([]);
            setShowAssignDialog(false);
            toast.success("Permisos asignados correctamente.");


        } catch (error) {
            console.error("Error al asignar permisos:", error);
            toast.error("Error inesperado al asignar los permisos.");
        }
    };


    const removePermissions = async () => {
        if (!selectedEmployee || selectedAssigned.length === 0) return;

        const permisosRevocar = selectedAssigned.map((key) => {
            const [, permId] = key.split(":");
            return parseInt(permId);
        });

        try {
            const respuesta = await removerPermisosUsuario({
                idEmpleado: selectedEmployee,
                permisos: permisosRevocar
            });

            if (!respuesta.success) {
                toast.error("Error al revocar los permisos.");
                return;
            }

            // Primero, obtén los permisos que vas a mover
            const toUnassign = selectedAssigned.map((key) => {
                const [roleName, permIdStr] = key.split(":");
                const permId = parseInt(permIdStr, 10);            // <-- convertir a número
                const role = assigned.find((r) => r.role === roleName);
                const perm = role?.permissions.find((p) => p.id === permId);
                return perm ? { roleName, perm } : null;
            }).filter(Boolean);

            console.log("Permisos a revocar:", toUnassign);
            console.log("Permisos seleccionados:", assigned);
            // Actualiza el listado de asignados
            const updatedAssigned = assigned.map((role) => ({
                ...role,
                permissions: role.permissions.filter(
                    (p) => !selectedAssigned.includes(`${role.role}:${p.id}`)
                ),
            })).filter((role) => role.permissions.length > 0);

            const updatedUnassigned = unassigned.map((r) => ({
                ...r,
                permissions: [...r.permissions]
            }));

            toUnassign.forEach(({ roleName, perm }) => {
                const unassignedRole = updatedUnassigned.find((r) => r.role === roleName);
                if (unassignedRole) {
                    unassignedRole.permissions = [...unassignedRole.permissions, perm];
                } else {
                    updatedUnassigned.push({ role: roleName, permissions: [perm] });
                }
            });

            setAssigned([...updatedAssigned]);
            setUnassigned([...updatedUnassigned]);
            setSelectedAssigned([]);
            setShowRemoveDialog(false);
            toast.success("Permisos revocados correctamente.");


        } catch (error) {
            console.error("Error al revocar permisos:", error);
            toast.error("Error inesperado al revocar los permisos.");
        }
    };


    const resetState = () => {
        setUnassigned([]);
        setAssigned([]);
        setSelectedUnassigned([]);
        setSelectedAssigned([]);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10">
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
                        Gestión de Roles y Permisos
                    </h1>

                    <div className="mb-8 flex items-center justify-center">
                        <label className="mr-4 font-semibold text-gray-700">
                            Selecciona un empleado:
                        </label>
                        <select
                            className="border border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={selectedEmployee}
                            onChange={(e) => {
                                setSelectedEmployee(e.target.value);
                                resetState();
                            }}
                        >
                            <option value="">-- Selecciona --</option>
                            {mockEmployees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-8">
                        {/* Unassigned */}
                        <div className="flex-1 bg-indigo-50 rounded-lg p-4 shadow-inner">
                            <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                                Permisos sin asignar
                            </h2>
                            {unassigned.length === 0 && (
                                <div className="text-gray-400 italic">No hay permisos disponibles</div>
                            )}
                            {unassigned.map((role) => (
                                <div key={role.role} className="mb-4">
                                    <div className="font-semibold text-indigo-500 mb-1">{role.role}</div>
                                    <ul>
                                        {role.permissions.map((perm) => {
                                            const key = `${role.role}:${perm.id}`;
                                            return (
                                                <li key={perm.id} className="flex items-center mb-1">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-indigo-500 mr-2"
                                                        checked={selectedUnassigned.includes(key)}
                                                        onChange={() => toggleSelection(key, selectedUnassigned, setSelectedUnassigned)}
                                                    />
                                                    <span className="text-gray-700">{perm.name}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Center Buttons */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
                                disabled={!selectedUnassigned.length || !selectedEmployee}
                                onClick={() => setShowAssignDialog(true)}
                            >
                                Asignar →
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
                                disabled={!selectedAssigned.length || !selectedEmployee}
                                onClick={() => setShowRemoveDialog(true)}
                            >
                                ← Retirar
                            </button>
                        </div>

                        {/* Assigned */}
                        <div className="flex-1 bg-green-50 rounded-lg p-4 shadow-inner">
                            <h2 className="text-lg font-semibold text-green-600 mb-2">
                                Permisos asignados
                            </h2>
                            {assigned.length === 0 && (
                                <div className="text-gray-400 italic">No hay permisos asignados</div>
                            )}
                            {assigned.map((role) => (
                                <div key={role.role} className="mb-4">
                                    <div className="font-semibold text-green-500 mb-1">{role.role}</div>
                                    <ul>
                                        {role.permissions.map((perm) => {
                                            const key = `${role.role}:${perm.id}`;
                                            return (
                                                <li key={perm.id} className="flex items-center mb-1">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-green-500 mr-2"
                                                        checked={selectedAssigned.includes(key)}
                                                        onChange={() => toggleSelection(key, selectedAssigned, setSelectedAssigned)}
                                                    />
                                                    <span className="text-gray-700">{perm.name}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dialogs */}

                <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-indigo-700">Confirmar asignación</DialogTitle>
                            <DialogDescription>
                                ¿Asignar los permisos seleccionados al usuario?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancelar</Button>
                            <Button onClick={() => {
                                assignPermissions();
                                setShowAssignDialog(false);
                            }}>
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-red-600">Confirmar retiro</DialogTitle>
                            <DialogDescription>
                                ¿Retirar los permisos seleccionados del usuario?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>Cancelar</Button>
                            <Button variant="destructive" onClick={() => {
                                removePermissions();
                                setShowRemoveDialog(false);
                            }}>
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </Layout>
    );
}
