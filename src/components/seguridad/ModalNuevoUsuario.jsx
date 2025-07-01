import { useEffect, useState } from "react";
import { PasswordRequirements, validarPassword } from "../../utils/seguridadContra";
import { toast } from "react-toastify";
import { crearUsuario, ObtenerEmpleadosSinUsuario } from "../../services/usuarios";
const ModalNuevoUsuario = ({setShowNuevo, setUsuarios, usuarios}) => {
    const [nuevoEmpleado, setNuevoEmpleado] = useState("");
    const [nuevoUsuario, setNuevoUsuario] = useState("");
    const [nuevoPassword, setNuevoPassword] = useState("");
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        fetchEmpleados();
    }, [])

    const fetchEmpleados = async () => {
        try
        {

            const respuesta = await ObtenerEmpleadosSinUsuario()
            console.log(respuesta);
            if (!respuesta.success) {
                toast.error("Error al obtener empleados sin usuario");
                return;
            }
            setEmpleados(respuesta.data);
        }
        catch (error) {
            console.error("Error al obtener empleados:", error);
            toast.error("Error al obtener empleados");
        }
    };
    const handleNuevo = () => {
        setNuevoEmpleado("");
        setNuevoUsuario("");
        setNuevoPassword("");
        setShowNuevo(true);
    };

    const guardarNuevo = async() => {
        if (
            !nuevoEmpleado ||
            !nuevoUsuario ||
            !validarPassword(nuevoPassword)
        )
            return;

        try
        {
            const respuesta = await crearUsuario({
                idEmpleado: Number(nuevoEmpleado),
                usuario: nuevoUsuario,
                password: nuevoPassword,
            })

            if(!respuesta.success) {
                toast.error("Error al crear usuario");
                return;
            }
            setUsuarios((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                usuario: nuevoUsuario,
                nombreCompleto: empleados.find(e => e.idEmpleado === Number(nuevoEmpleado)).nombreCompleto,
                idEmpleado: Number(nuevoEmpleado),
                activo: true,
            },
        ]);
        toast.success("Usuario creado exitosamente");
        setShowNuevo(false);

        }
        catch (error) {
            console.error("Error al guardar nuevo usuario:", error);
            toast.error("Error al guardar nuevo usuario");
        }

        
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full animate-fade-in">
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                    Nuevo Usuario
                </h2>
                <div className="mb-3">
                    <label className="block text-gray-700 mb-1">Empleado</label>
                    <select
                        className="w-full px-3 py-2 border rounded"
                        value={nuevoEmpleado}
                        onChange={(e) => setNuevoEmpleado(e.target.value)}
                    >
                        <option value="">Seleccione un empleado</option>
                        {empleados.map((e) => (
                            <option key={e.idEmpleado} value={e.idEmpleado}>
                                {e.nombreCompleto}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 mb-1">Usuario</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        value={nuevoUsuario}
                        onChange={(e) => setNuevoUsuario(e.target.value)}
                        placeholder="Nombre de usuario"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Contraseña</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded"
                        value={nuevoPassword}
                        onChange={(e) => setNuevoPassword(e.target.value)}
                        placeholder="Contraseña"
                    />
                    <PasswordRequirements password={nuevoPassword} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        onClick={() => setShowNuevo(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white ${nuevoEmpleado &&
                            nuevoUsuario &&
                            validarPassword(nuevoPassword)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                        disabled={
                            !nuevoEmpleado ||
                            !nuevoUsuario ||
                            !validarPassword(nuevoPassword)
                        }
                        onClick={guardarNuevo}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalNuevoUsuario;