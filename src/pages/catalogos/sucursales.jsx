import { uploadUrl } from '../../lib/apiConfig';
import React, { useEffect, useState } from "react";
import Layout from "../../components/general/layout";
import { SucursalForm } from "../../components/catalogos/FormularioSucursal";
import { toast } from "react-toastify";
import { actualizarSucursal, crearSucursales, EliminarSucursal } from "../../services/sucursales";
import { obtenerDatosFormularioCliente } from "../../services/datos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SucursalesPage() {
    const [sucursales, setSucursales] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
    const [mostrarDialogoAnular, setMostrarDialogoAnular] = useState(false);
    useEffect(() => {
        fetchSucursales();
    }, []);

    const fetchSucursales = async () => {
        try {
            const response = await obtenerDatosFormularioCliente();
            console.log("Datos obtenidos:", response);
            if (response?.success) {
                setSucursales(response.data?.sucursales || []);
                setCiudades(response.data?.ciudades || []);
            } else {
                toast.error("Error al cargar las sucursales. Intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
            toast.error("Error al cargar las sucursales. Intenta nuevamente.");
        }
    };

    const handleCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const handleEdit = (branch) => {
        setEditing(branch);
        setModalOpen(true);
    };

    const handleSave = async (data) => {
        if (!data) return;
        console.log("editing", editing);
        if (editing) {
            try {

                const actualizarData = await actualizarSucursal(data);
                if (!actualizarData?.success) {
                    toast.error("Error al actualizar la sucursal. Intenta nuevamente.");
                    return;
                }
                toast.success("Sucursal actualizada exitosamente.");
                setSucursales(prev =>
                    prev.map((b) => (b.idSucursal === editing.idSucursal ? { ...b, ...data } : b))
                );
            } catch (error) {
                console.error("Error al actualizar la sucursal:", error);
                toast.error("Error al actualizar la sucursal. Intenta nuevamente.");
            }


        } else {
            try {
                const respuesta = await crearSucursales(data);
                if (!respuesta?.success) {
                    toast.error("Error al crear la sucursal. Intenta nuevamente.");
                    return;
                }
                const nuevaSucursal = respuesta.data || { ...data, id: Date.now() };
                setSucursales(prev => [...prev, nuevaSucursal]);
                toast.success("Sucursal creada exitosamente.");
            } catch (error) {
                console.error("Error al guardar la sucursal:", error);
                toast.error("Error al guardar la sucursal. Intenta nuevamente.");
            }
        }
        setModalOpen(false);
    };

    const confirmarAnulacion = (factura) => {
        setSucursalSeleccionada(factura);
        setMostrarDialogoAnular(true);
      };

      const handleEliminarSucursal = async() => {
        try
        {
          const response = await EliminarSucursal(sucursalSeleccionada.idSucursal);
          if (!response.success) {
            throw new Error("Error al anular la sucursal");
          }
        setSucursales(sucursales.filter(f => f.idSucursal !== sucursalSeleccionada.idSucursal));
        toast.success(`Sucursal ${sucursalSeleccionada.nombre} eliminada exitosamente.`);
        setMostrarDialogoAnular(false)
      } catch (error) {
        console.error("Error al anular la factura:", error);
        toast.error("Error al eliminar la sucursal. Por favor, inténtelo de nuevo más tarde.");
        }
      };
    return (
        <Layout>
            <Dialog open={mostrarDialogoAnular} onOpenChange={setMostrarDialogoAnular}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>¿Desea eliminar esta sucursal?</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center">
                        <p className="text-lg mb-4">
                            Está a punto de eliminar la sucursal <strong>{sucursalSeleccionada?.nombre}</strong>. ¿Está seguro?
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={() => setMostrarDialogoAnular(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleEliminarSucursal} className="bg-red-500 text-white hover:bg-red-600">
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Sucursales</h1>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            + Nueva Sucursal
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {sucursales.length === 0 ? (
                            <p className="text-center text-gray-600 col-span-2">
                                No hay sucursales registradas.
                            </p>
                        ) : (
                            sucursales.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="bg-white rounded-xl shadow-lg p-6 flex gap-6 items-center hover:shadow-2xl transition"
                                >
                                    <img
                                        src={branch.logo ? uploadUrl(branch.logo) : "https://placehold.co/80x80?text=Logo"}
                                        alt={branch.nombre || "Sucursal"}
                                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                                                {branch.codigoSucursal || "SIN CÓDIGO"}
                                            </span>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {branch.nombre || "Sucursal sin nombre"}
                                            </h2>
                                        </div>
                                        <div className="text-gray-600 text-sm mb-1">
                                            <span className="font-medium">Dirección:</span>{" "}
                                            {branch.direccion || "No especificada"}
                                        </div>
                                        <div className="text-gray-600 text-sm mb-1">
                                            <span className="font-medium">Ciudad:</span>{" "}
                                            {branch.idCiudad?.nombre || "No especificada"}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            <span className="font-medium">Teléfonos:</span>{" "}
                                            {Array.isArray(branch.sucursalTelefonos) && branch.sucursalTelefonos.length > 0 ? (
                                                branch.sucursalTelefonos.map((tel, idx) => (
                                                    <span key={idx} className="inline-block mr-2">
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                            {tel.numero}
                                                        </span>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">No registrados</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleEdit(branch)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => confirmarAnulacion(branch)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <SucursalForm
                    open={modalOpen}
                    onClose={() => { setModalOpen(false); setEditing(null); }}
                    onSave={handleSave}
                    initialData={editing}
                    ciudades={ciudades}
                />
            </div>
        </Layout>
    );
}
