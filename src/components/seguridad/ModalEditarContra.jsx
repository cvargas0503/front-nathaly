import { useState } from "react";
import { PasswordRequirements, validarPassword } from "../../utils/seguridadContra"
import { toast } from "react-toastify";
import { modificarPassword } from "../../services/usuarios";

export const ModalEditarContra = ({ setShowEditar, usuario }) => {
    const [nuevaPassword, setNuevaPassword] = useState("");

    const guardarEdicion = async() => {
        if (!validarPassword(nuevaPassword)) return;
        // Aquí iría el update real
        try
        {
            const respuesta = await modificarPassword(nuevaPassword, usuario.idUsuario);
            console.log(respuesta); 
            if (!respuesta.success) {
                toast.error("Error al actualizar la contraseña");
                return;
            }
            toast.success("Contraseña actualizada correctamente");
            setShowEditar(false);
        }
        catch (error) {
            toast.error("Error al actualizar la contraseña");
            console.error("Error al actualizar la contraseña:", error);
            return;
        }
        
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full animate-fade-in">
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                    Editar Usuario
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Usuario</label>
                    <input
                        type="text"
                        value={usuario?.usuario}
                        disabled
                        className="w-full px-3 py-2 border rounded bg-gray-100"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 mb-1">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={nuevaPassword}
                        onChange={(e) => setNuevaPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Ingrese nueva contraseña"
                    />
                    <PasswordRequirements password={nuevaPassword} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        onClick={() => setShowEditar(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white ${validarPassword(nuevaPassword)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                        disabled={!validarPassword(nuevaPassword)}
                        onClick={guardarEdicion}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}