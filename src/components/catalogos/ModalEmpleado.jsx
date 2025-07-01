import React, { useEffect, useState } from "react";
import { obtenerDatosFormularioCliente } from "../../services/datos";

export default function ModalEmpleado({ show = true, onClose = null, onSave = null, empleadoEditar = null, isLoading = false}) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    celular: "",
    email: "",
    idCiudad: 0,
    tipoDoc: "",
    numDoc: "",
    idSucursal: 0,
    puesto: ""
  });

  const [errores, setErrores] = useState({});
  const [ciudades, setCiudades] = useState([]);
  const [sucursales, setSucursales] = useState([]);

useEffect(() => {
  if (show) {
    setErrores({})
    cargarDatosIniciales();

    if (empleadoEditar) {
      console.log(empleadoEditar)
      // Asegura que si algún valor está faltando, se use el valor por defecto
      setForm(prev => ({
        ...prev,
        ...{
          nombres: empleadoEditar.nombres || "",
          apellidos: empleadoEditar.apellidos || "",
          direccion: empleadoEditar.direccion || "",
          telefono: empleadoEditar.telefono || "",
          celular: empleadoEditar.celular || "",
          email: empleadoEditar.email || "",
          idCiudad: empleadoEditar.idCiudad ?? 0,
          tipoDoc: empleadoEditar.tipoDoc || "",
          numDoc: empleadoEditar.numDoc || "",
          idSucursal: empleadoEditar.idSucursal ?? 0,
          puesto: empleadoEditar.puesto || "",
        }
      }));
    } else {
      resetForm();
    }
  }
}, [show, empleadoEditar]);

  const cargarDatosIniciales = async () => {
    const res = await obtenerDatosFormularioCliente();
    if (res.success) {
      setCiudades(res.data.ciudades);
      setSucursales(res.data.sucursales);
    }
  };

  const resetForm = () => {
    setForm({
      nombres: "",
      apellidos: "",
      direccion: "",
      telefono: "",
      celular: "",
      email: "",
      idCiudad: 0,
      tipoDoc: "",
      numDoc: "",
      idSucursal: 0,
      puesto: ""
    });
    setErrores({});
  };
const formatCedula = (value) => {
    // Eliminar todos los caracteres no alfanuméricos y convertir a mayúsculas
    let cleaned = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    
    // Separar los dígitos (primeros 13 caracteres) de la letra final (último carácter)
    let digits = cleaned.replace(/[^0-9]/g, '');
    let letter = cleaned.replace(/[^A-Za-z]/g, '').slice(-1);
    
    // Construir el formato: 3 dígitos + 6 dígitos + 4 dígitos + 1 letra
    let formatted = '';
    if (digits.length > 0) {
        formatted = digits.slice(0, 3);
        if (digits.length > 3) {
            formatted += '-' + digits.slice(3, 9);
            if (digits.length > 9) {
                formatted += '-' + digits.slice(9, 13);
            }
        }
    }
    
    if (letter && formatted.length >= 13) {
        formatted = formatted.slice(0, 15) + letter;
    } else if (letter && formatted.length > 0) {
        formatted += letter;
    }
    
    return formatted.slice(0, 16);
};

const validateEmail = (email) => {
    // Validación básica de email que requiere @ y .
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
  const formatTelefono = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    if (cleaned.length > 4) return cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    return cleaned;
  };

  const handleChange = (key, value) => {
    if (key === "numDoc" && form.tipoDoc === "CED") {
      value = formatCedula(value);
    }
    if (key === "telefono" || key === "celular") {
      value = formatTelefono(value);
    }
    setForm({ ...form, [key]: value });
  };

  const handleGuardar = () => {
    const camposRequeridos = {
      nombres: "El nombre del empleado es requerido.",
      apellidos: "El apellido del empleado es obligatorio.",
      direccion: "La dirección del empleado es necesaria.",
      celular: "El celular del empleado es obligatorio.",
      idCiudad: "La ciudad del empleado es obligatoria",
      tipoDoc: "Selecciona un tipo de documento",
      numDoc: "El número de documento es obligatorio",
      idSucursal: "Es necesario asignar una sucursal al empleado",
      puesto: "El puesto del empleado es obligatorio"
    };

    const nuevosErrores = {};
    Object.entries(camposRequeridos).forEach(([key, mensaje]) => {
      const valor = form[key];
      if (typeof valor === "string" && !valor.trim()) nuevosErrores[key] = mensaje;
      else if ((typeof valor === "number" || typeof valor === "boolean") && !valor) nuevosErrores[key] = mensaje;
    });

     if (form.email.trim() && !validateEmail(form.email)) {
        nuevosErrores.email = "El correo electrónico debe contener @ y un dominio válido (ejemplo: usuario@dominio.com)";
    }
    const totalPalabras = `${form.nombres} ${form.apellidos}`.trim().split(/\s+/).length;
    if (totalPalabras < 2) {
      nuevosErrores.nombres = "Debe ingresar al menos un nombre y un apellido.";
      nuevosErrores.apellidos = "Debe ingresar al menos un nombre y un apellido.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">{empleadoEditar ? "Editar Empleado" : "Nuevo Empleado"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["nombres", "apellidos", "direccion", "telefono", "celular", "email"].map((key) => (
            <div key={key}>
              <label className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)} *</label>
              <input
                className={inputClass}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              {errores[key] && <p className="text-red-500 text-sm">{errores[key]}</p>}
            </div>
          ))}
          <div>
              <label className="font-semibold">Tipo de Documento *</label>
              <select
                className={inputClass}
                value={form.tipoDoc}
                onChange={(e) => setForm({ ...form, tipoDoc: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="CED">Cédula</option>
                <option value="RUC">RUC</option>
                <option value="PAS">Pasaporte</option>
              </select>
              {errores.tipoDoc && <p className="text-red-500 text-sm">{errores.tipoDoc}</p>}
          </div>
           <div>
              <label className="font-semibold">Numero de documento*</label>
              <input
                className={inputClass}
                value={form.numDoc}
                onChange={(e) => handleChange("numDoc", e.target.value)}
              />
              {errores.numDoc && <p className="text-red-500 text-sm">{errores.numDoc}</p>}
            </div>

          <div>
            <label className="font-semibold">Ciudad *</label>
            <select
              className={inputClass}
              value={form.idCiudad}
              onChange={(e) => setForm({ ...form, idCiudad: Number(e.target.value) })}
            >
              <option value="">Seleccione</option>
              {ciudades.map(c => (
                <option key={c.idCiudad} value={c.idCiudad}>{c.nombre}</option>
              ))}
            </select>
            {errores.idCiudad && <p className="text-red-500 text-sm">{errores.idCiudad}</p>}
          </div>

          <div>
            <label className="font-semibold">Sucursal *</label>
            <select
              className={inputClass}
              value={form.idSucursal}
              onChange={(e) => setForm({ ...form, idSucursal: Number(e.target.value) })}
            >
              <option value="">Seleccione</option>
              {sucursales.map(s => (
                <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>
              ))}
            </select>
            {errores.idSucursal && <p className="text-red-500 text-sm">{errores.idSucursal}</p>}
          </div>

          <div>
              <label className="font-semibold">Puesto*</label>
              <input
                className={inputClass}
                value={form.puesto}
                onChange={(e) => handleChange("puesto", e.target.value)}
              />
              {errores.puesto && <p className="text-red-500 text-sm">{errores.puesto}</p>}
            </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
          <button className={`
           text-white px-6 py-2 rounded 
             shadow transition bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-indigo-600 hover:to-purple-600
              active:scale-95
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
            `} onClick={handleGuardar}>
           {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Guardando...
              </span>
          ) : (
              "Guardar"
          )}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass = "w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400";