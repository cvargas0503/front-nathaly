import { uploadUrl } from '../../lib/apiConfig';
import React, { useEffect, useState } from "react";
import { obtenerDatosFormularioProducto } from "../../services/datos";

export default function ModalProducto({ show = true, onClose = null, onSave = null, productoEditar = null }) {
  const [form, setForm] = useState({
    codigo: "",
    referencia: "",
    descripcion: "",
    costo: 0,
    existenciaMin: 0,
    existenciaMax: 0,
    idMarca: 0,
    idProveedor: 0,
    idCategoria: 0,
    idLinea: 0,
    precios: {},
    imagen: null,
  });
  const [errores, setErrores] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [listasPrecio, setListasPrecio] = useState([]);

  useEffect(() => {
    if (show) {
      cargarDatosIniciales();
      console.log(productoEditar)
      if (productoEditar) setForm(productoEditar);
      else resetForm();
    }
  }, [show]);

  const cargarDatosIniciales = async () => {
    const res = await obtenerDatosFormularioProducto();
    console.log("Datos iniciales:", res);
    console.log(res)
    if (res.success) {
      setMarcas(res.data.marcas);
      setProveedores(res.data.proveedores);
      setCategorias(res.data.categorias);
      setListasPrecio(res.data.listasPrecio);
      setLineas(res.data.lineas)
    }
  };

  const resetForm = () => {
    setForm({
      codigo: "",
      descripcion: "",
      costo: 0,
      existenciaMin: 0,
      existenciaMax: 0,
      idMarca: 0,
      idProveedor: 0,
      idCategoria: 0,
      idLinea: 0,
      precios: {},
      imagen: null,
    });
    setErrores({});
  };

  const handleGuardar = () => {
    const errs = {};
    if (!form.referencia) errs.referencia = "La referencia es obligatoria.";
    if (!form.codigo) errs.codigo = "El código es obligatorio.";
    if (!form.descripcion) errs.descripcion = "La descripción es obligatoria.";
    if (!form.costo || form.costo <= 0) errs.costo = "Costo inválido.";
    if (!form.idMarca) errs.idMarca = "Seleccione una marca.";
    if (!form.idProveedor) errs.idProveedor = "Seleccione un proveedor.";
    if (!form.idCategoria) errs.idCategoria = "Seleccione una categoría.";
    if (!form.idLinea) errs.idLinea = "Seleccione una linea.";


    listasPrecio.forEach(lp => {
      const val = form.precios[lp.idListaPrecio];
      if (!val || val <= 0) {
        errs[`precio_${lp.idListaPrecio}`] = `Precio para ${lp.nombre} requerido.`;
      }
    });

    if (Object.keys(errs).length > 0) return setErrores(errs);

    onSave(form);
  };



  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">{productoEditar ? "Editar Producto" : "Nuevo Producto"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold">Referencia *</label>
            <input className={inputClass} value={form.referencia} onChange={(e) => setForm({ ...form, referencia: e.target.value })} />
            {errores.referencia && <p className="text-red-500 text-sm">{errores.referencia}</p>}
          </div>

          <div>
            <label className="font-semibold">Código *</label>
            <input className={inputClass} value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
            {errores.codigo && <p className="text-red-500 text-sm">{errores.codigo}</p>}
          </div>

          <div>
            <label className="font-semibold">Descripción *</label>
            <input className={inputClass} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            {errores.descripcion && <p className="text-red-500 text-sm">{errores.descripcion}</p>}
          </div>

          <div>
            <label className="font-semibold">Costo *</label>
            <input type="number" className={inputClass} value={form.costo} onChange={(e) => setForm({ ...form, costo: e.target.value })} />
            {errores.costo && <p className="text-red-500 text-sm">{errores.costo}</p>}
          </div>

          <div>
            <label className="font-semibold">Existencia Min *</label>
            <input type="number" className={inputClass} value={form.existenciaMin} onChange={(e) => setForm({ ...form, existenciaMin: e.target.value })} />
          </div>

          {/* <div>
            <label className="font-semibold">Existencia Max *</label>
            <input type="number" className={inputClass} value={form.existenciaMax} onChange={(e) => setForm({ ...form, existenciaMax: e.target.value })} />
          </div> */}

          <div>
            <label className="font-semibold">Marca *</label>
            <select className={inputClass} value={form.idMarca} onChange={(e) => setForm({ ...form, idMarca: e.target.value })}>
              <option value="">Seleccione</option>
              {marcas && marcas.length > 0 && (
                marcas.map(m => <option key={m.idMarca} value={m.idMarca}>{m.nombre}</option>)
              )}
            </select>
            {errores.idMarca && <p className="text-red-500 text-sm">{errores.idMarca}</p>}
          </div>

          <div>
            <label className="font-semibold">Proveedor *</label>
            <select className={inputClass} value={form.idProveedor} onChange={(e) => setForm({ ...form, idProveedor: e.target.value })}>
              <option value="">Seleccione</option>
              {proveedores && proveedores.length > 0 && (
                proveedores.map(p => <option key={p.idProveedor} value={p.idProveedor}>{p.nombre}</option>)
              )}
            </select>
            {errores.idProveedor && <p className="text-red-500 text-sm">{errores.idProveedor}</p>}
          </div>

          <div>
            <label className="font-semibold">Categoría *</label>
            <select className={inputClass} value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })}>
              <option value="">Seleccione</option>
              {categorias && categorias.length > 0 && (
                categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)
              )}
            </select>
            {errores.idCategoria && <p className="text-red-500 text-sm">{errores.idCategoria}</p>}
          </div>

          <div>
            <label className="font-semibold">Linea *</label>
            <select className={inputClass} value={form.idLinea} onChange={(e) => setForm({ ...form, idLinea: e.target.value })}>
              <option value="">Seleccione</option>
              {lineas && lineas.length > 0 && (
                lineas.map(c => <option key={c.idLinea} value={c.idLinea}>{c.nombre}</option>)
              )}
            </select>
            {errores.idLinea && <p className="text-red-500 text-sm">{errores.idLinea}</p>}
          </div>

          {listasPrecio.map(lp => (
            <div key={lp.idListaPrecio}>
              <label className="font-semibold">Precio {lp.nombre} *</label>
              <input
                type="number"
                className={inputClass}
                value={form.precios[lp.idListaPrecio] || ""}
                onChange={(e) => setForm({
                  ...form,
                  precios: {
                    ...form.precios,
                    [lp.idListaPrecio]: e.target.value
                  }
                })}
              />
              {errores[`precio_${lp.idListaPrecio}`] && (
                <p className="text-red-500 text-sm">{errores[`precio_${lp.idListaPrecio}`]}</p>
              )}
            </div>
          ))}
          <div className="md:col-span-3 text-center">
            <label className="font-semibold block mb-2">Imagen del producto</label>

            {!form.imagen ? (
              <>
                <label
                  htmlFor="imagen"
                  className="cursor-pointer inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
                >
                  Subir imagen
                </label>
                <input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm({ ...form, imagen: file });
                  }}
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="w-40 h-40 rounded overflow-hidden border shadow">
                  <img
                    src={productoEditar ? uploadUrl(form.imagen) : URL.createObjectURL(form.imagen)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="text-sm text-red-600 hover:underline mt-1"
                  onClick={() => setForm({ ...form, imagen: null })}
                >
                  Eliminar imagen
                </button>
              </div>
            )}
          </div>


        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded" onClick={handleGuardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}


const inputClass = "w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400";
