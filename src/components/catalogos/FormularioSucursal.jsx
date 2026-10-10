import { uploadUrl } from '../../lib/apiConfig';
import { useEffect, useState } from "react";
import { UploadCloud, X } from "lucide-react";

export function SucursalForm({ open, onClose, onSave, initialData, ciudades = [] }) {
    const [form, setForm] = useState(
        {
            logo: "",
            logoFile: null,
            codigoSucursal: "",
            nombre: "",
            direccion: "",
            idCiudad: 0,
            telefonos: [""],
        }
    );

    useEffect(() => {
        if (open && !initialData) {
            // Si se abre en modo "crear"
            setForm({
                logo: "",
                logoFile: null,
                codigoSucursal: "",
                nombre: "",
                direccion: "",
                idCiudad: 0,
                telefonos: [""],
            });
        }

        if (open && initialData) {
            setForm({
                logo: initialData.logo || "",
                logoFile: null,
                codigoSucursal: initialData.codigoSucursal || "",
                nombre: initialData.nombre || "",
                direccion: initialData.direccion || "",
                idCiudad: initialData.idCiudad?.idCiudad || 0,
                telefonos: initialData.sucursalTelefonos?.map(t => t.numero) || [""],
            });
        }
    }, [open, initialData]);


    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTelefonoChange = (idx, value) => {
        const telefonos = [...form.telefonos];
        telefonos[idx] = value;
        setForm({ ...form, telefonos });
    };

    const addTelefono = () => {
        setForm({ ...form, telefonos: [...form.telefonos, ""] });
    };

    const removeTelefono = (idx) => {
        const telefonos = form.telefonos.filter((_, i) => i !== idx);
        setForm({ ...form, telefonos });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            console.log("Preview URL:", previewUrl);
            setForm({ ...form, logo: previewUrl, logoFile: file });
        }
    };

    const eliminarImagen = () => {
        setForm({ ...form, logo: "", logoFile: null });
    };

    const validarCampos = () => {
        const newErrors = {};
        if (!form.logo && !initialData) newErrors.logo = "El logo es obligatorio.";
        if (!form.codigoSucursal.trim()) newErrors.codigoSucursal = "El código es obligatorio.";
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
        if (!form.direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
        if (!form.idCiudad || form.idCiudad === "0") newErrors.idCiudad = "Selecciona una ciudad.";
        if (form.telefonos.length === 0 || form.telefonos.some((t) => !t.trim())) newErrors.telefonos = "Todos los teléfonos son obligatorios.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarCampos()) return;

        const dataToSend = {
            ...form,
            idSucursal: initialData?.idSucursal || undefined, // Solo enviar id si es edición
        };

        // Si no se cargó una nueva imagen, mantenemos el logo actual
        if (!form.logoFile && initialData) {
            delete dataToSend.logoFile;
            dataToSend.logo = initialData.logo;
        } else {
            dataToSend.imagen = form.logoFile;
            delete dataToSend.logoFile;
        }

        onSave(dataToSend);

    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center mb-6">
                    {initialData ? "Editar Sucursal" : "Nueva Sucursal"}
                </h2>            <form
                    className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl space-y-6"
                    onSubmit={handleSubmit}
                >

                    <div className="space-y-2">
                        <label className="block text-sm font-medium mb-1">Logo de la Sucursal</label>
                        {form.logo ? (
                            <div className="relative group w-32 h-32 mx-auto border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                                <img src={
                                    form.logo?.startsWith("blob:") || form.logo?.startsWith("http")
                                        ? form.logo
                                        : uploadUrl(form.logo)
                                }
                                    alt="Logo" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={eliminarImagen}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                                    title="Eliminar"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className={`w-full flex flex-col items-center justify-center border-2 ${errors.logo ? "border-red-500" : "border-gray-300"} border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition`}>
                                <UploadCloud className="text-gray-500 mb-2" size={32} />
                                <span className="text-gray-600 text-sm">Haz clic para subir una imagen</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Código</label>
                            <input
                                type="text"
                                name="codigoSucursal"
                                value={form.codigoSucursal}
                                onChange={handleChange}
                                className={`w-full border rounded px-3 py-2 focus:ring-2 ${errors.codigoSucursal ? "border-red-500" : "focus:ring-blue-500"}`}
                            />
                            {errors.codigoSucursal && <p className="text-red-500 text-sm mt-1">{errors.codigoSucursal}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                className={`w-full border rounded px-3 py-2 focus:ring-2 ${errors.nombre ? "border-red-500" : "focus:ring-blue-500"}`}
                            />
                            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            className={`w-full border rounded px-3 py-2 focus:ring-2 ${errors.direccion ? "border-red-500" : "focus:ring-blue-500"}`}
                        />
                        {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ciudad</label>
                        <select
                            name="idCiudad"
                            value={form.idCiudad}
                            onChange={handleChange}
                            className={`w-full border rounded px-3 py-2 focus:ring-2 ${errors.idCiudad ? "border-red-500" : "focus:ring-blue-500"}`}
                        >
                            <option value="0">Selecciona una ciudad</option>
                            {ciudades.map((c) => (
                                <option key={c.idCiudad} value={c.idCiudad}>{c.nombre}</option>
                            ))}
                        </select>
                        {errors.idCiudad && <p className="text-red-500 text-sm mt-1">{errors.idCiudad}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Teléfonos</label>
                        <div className="space-y-2">
                            {form.telefonos.map((tel, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={tel}
                                        onChange={(e) => handleTelefonoChange(idx, e.target.value)}
                                        className={`w-full border rounded px-3 py-2 focus:ring-2 ${errors.telefonos ? "border-red-500" : "focus:ring-blue-500"}`}
                                    />
                                    {form.telefonos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTelefono(idx)}
                                            className="text-red-500 hover:text-red-700 text-xl"
                                            title="Eliminar teléfono"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            ))}
                            {errors.telefonos && <p className="text-red-500 text-sm mt-1">{errors.telefonos}</p>}
                            <button
                                type="button"
                                onClick={addTelefono}
                                className="text-blue-600 hover:underline text-sm mt-1"
                            >
                                + Agregar teléfono
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                setErrors({});
                                }}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
