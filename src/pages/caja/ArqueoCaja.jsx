import React, { useEffect, useState } from "react";
import { FiPrinter, FiChevronDown, FiCalendar, FiUser, FiMapPin, FiSave, FiXCircle } from "react-icons/fi";
import Layout from "../../components/general/layout";
import { toast } from "react-toastify";
import { obtenerDatosArqueoIni, cargarArqueoAPI, guardarArqueoAPI } from "../../services/arqueo";
import LoadingComponent from "../../components/auth/loadingComponent";

function DenominationInput({ title, values, setValues, color }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex-1">
            <h3 className={`text-lg font-semibold mb-2 ${color}`}>{title}</h3>
            <div className="grid grid-cols-3 gap-2 text-sm font-medium">
                <div>Denominación</div>
                <div>Cantidad</div>
                <div>Total</div>
                {values.map((denom) => (
                    <React.Fragment key={denom.idDenominacion}>
                        <div className="py-1">{denom.valor}</div>
                        <input
                            type="number"
                            min={0}
                            className="border rounded px-2 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            value={denom.cantidad || 0}
                            onChange={e => {
                                const newArr = [...values];
                                const index = newArr.findIndex(d => d.idDenominacion === denom.idDenominacion);
                                if (index === -1) return; // No se encontró la denominación
                                newArr[index].cantidad = parseFloat(e.target.value) || 0;
                                setValues(newArr);
                            }}
                        />
                        <div className="py-1 text-right text-sky-700 font-semibold">
                            {(denom.valor * (denom.cantidad || 0)).toFixed(2)}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default function ArqueoCaja() {
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [empleado, setEmpleado] = useState(0);
    const [sucursal, setSucursal] = useState({ idSucursal: 0, nombre: "Seleccione una sucursal" });
    const [empleados, setEmpleados] = useState([]);
    const [arqueoAbierto, setArqueoAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cerrarHabilitado, setCerrarHabilitado] = useState(false);

    const [cordobaIni, setCordobaIni] = useState([]);
    const [dollarIni, setDollarIni] = useState([]);
    const [cordobaFin, setCordobaFin] = useState([]);
    const [dollarFin, setDollarFin] = useState([]);

    useEffect(() => {
        fetchDatos();
    }, []);

    const fetchDatos = async () => {
        try {
            const response = await obtenerDatosArqueoIni();
            if (!response.success) {
                toast.error("Error al cargar los datos iniciales.");
                return;
            }
            setEmpleados(response.data.empleados);
        } catch (error) {
            toast.error("Error al cargar los datos.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalCordobaIni = cordobaIni.reduce((acc, d, i) => acc + d.valor * (d.cantidad || 0), 0);
    const totalDollarIni = dollarIni.reduce((acc, d, i) => acc + d.valor * (d.cantidad || 0), 0);
    const totalCordobaFin = cordobaFin.reduce((acc, d, i) => acc + d.valor * (d.cantidad || 0), 0);
    const totalDollarFin = dollarFin.reduce((acc, d, i) => acc + d.valor * (d.cantidad || 0), 0);

    const cargarArqueo = async () => {
        try {
            const response = await cargarArqueoAPI(fecha, empleado, sucursal.idSucursal);
            if (!response.success) {
                toast.error("No se pudo cargar el arqueo.");
                return;
            }

            setCordobaIni(response.data.saldoInicialCordoba);
            setDollarIni(response.data.saldoInicialDolar);
            setCordobaFin(response.data.saldoFinalCordoba);
            setDollarFin(response.data.saldoFinalDolar);
            setArqueoAbierto(true);
            if (!response.abierto) {
                toast.info("No hay arqueo abierto para esta fecha.");
                setCerrarHabilitado(false);
                return;
            }
            toast.success("Arqueo cargado exitosamente.");
            setCerrarHabilitado(true);
        } catch (error) {
            toast.error("Error al cargar el arqueo.");
            console.error(error);
        }
    };

    const handleSelectEmpleado = (id) => {
        const emp = empleados.find(e => e.idEmpleado === parseInt(id));
        if (emp) {
            setEmpleado(emp.idEmpleado);
            setSucursal({ idSucursal: emp.idSucursal, nombre: emp.sucursal });
        } else {
            setEmpleado(0);
            setSucursal({ idSucursal: 0, nombre: "Seleccione una sucursal" });
        }
    };

    const handleGuardarArqueo = async () => {
        if (!arqueoAbierto) {
            toast.error("Debe cargar un arqueo primero.");
            return;
        }
        if (totalCordobaIni <= 0 && totalDollarIni <= 0 && totalCordobaFin <= 0 && totalDollarFin <= 0) {
            toast.error("Debe ingresar al menos un saldo inicial o final.");
            return;
        }
        setLoading(true);
        try {
            const arqueoData = {
                fecha,
                idEmpleado: empleado,
                idSucursal: sucursal.idSucursal,
                saldoInicialCordoba: cordobaIni,
                saldoInicialDolar: dollarIni,
                saldoFinalCordoba: cordobaFin,
                saldoFinalDolar: dollarFin
            };

            const response = await guardarArqueoAPI(arqueoData);
            if (response.success) {
                toast.success("Arqueo guardado exitosamente.");
            } else {
                toast.error("Error al guardar el arqueo.");
            }
        } catch (error) {
            toast.error("Error al guardar el arqueo.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 py-8 px-4">
                {loading && <LoadingComponent />}
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="text-sky-500">Arqueo de Caja</span>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div>
                            <label className="text-slate-700 font-medium mb-1 flex items-center gap-1">
                                <FiCalendar className="text-sky-400" /> Fecha
                            </label>
                            <input
                                type="date"
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400"
                                value={fecha}
                                onChange={e => setFecha(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-slate-700 font-medium mb-1 flex items-center gap-1">
                                <FiUser className="text-sky-400" /> Empleado
                            </label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400"
                                value={empleado}
                                onChange={e => handleSelectEmpleado(e.target.value)}
                            >
                                <option value={0}>Seleccione</option>
                                {empleados.map(emp => (
                                    <option key={emp.idEmpleado} value={emp.idEmpleado}>{emp.nombreCompleto}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-slate-700 font-medium mb-1 flex items-center gap-1">
                                <FiMapPin className="text-sky-400" /> Sucursal
                            </label>
                            <input
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                                value={sucursal.nombre}
                                disabled
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            {arqueoAbierto && (
                                <div className="mb-8">
                                    {/* Saldos Iniciales y Finales similares a tu diseño original */}
                                    {/* Botones de Guardar, Cerrar, Imprimir */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleGuardarArqueo}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                                        >
                                            <FiSave /> Guardar
                                        </button>
                                        {cerrarHabilitado && (
                                            <button
                                                // onClick={cerrarArqueo}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <FiXCircle /> Cerrar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => window.print()}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-slate-800 hover:bg-yellow-500"
                                        >
                                            <FiPrinter /> Imprimir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-sky-500 text-white shadow hover:bg-sky-600 transition disabled:opacity-50"
                        disabled={!fecha || !empleado}
                        onClick={cargarArqueo}
                    >
                        <FiChevronDown /> Cargar Arqueo
                    </button>
                    {arqueoAbierto && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-700 mb-4">Saldos Iniciales</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <DenominationInput title="Córdobas (C$)" values={cordobaIni} setValues={setCordobaIni} color="text-sky-500" />
                                    <DenominationInput title="Dólares ($)" values={dollarIni} setValues={setDollarIni} color="text-yellow-500" />
                                </div>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-700 mb-4">Saldos Finales</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <DenominationInput title="Córdobas (C$)" values={cordobaFin} setValues={setCordobaFin} color="text-sky-500" />
                                    <DenominationInput title="Dólares ($)" values={dollarFin} setValues={setDollarFin} color="text-yellow-500" />
                                </div>
                            </div>
                            <div className="bg-slate-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-inner">
                                <div>
                                    <h3 className="text-lg font-semibold text-sky-700 mb-2">Total Inicial</h3>
                                    <div className="flex gap-8 text-xl font-bold">
                                        <span className="text-sky-500">C$ {totalCordobaIni.toFixed(2)}</span>
                                        <span className="text-yellow-500">$ {totalDollarIni.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-sky-700 mb-2">Total Final</h3>
                                    <div className="flex gap-8 text-xl font-bold">
                                        <span className="text-sky-500">C$ {totalCordobaFin.toFixed(2)}</span>
                                        <span className="text-yellow-500">$ {totalDollarFin.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
