import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IoEyeOutline, IoPrintOutline, IoTrashOutline, IoAddCircleOutline, IoSearchOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { toast } from "react-toastify";
import Layout from "../../components/general/layout";
import ModalNuevaFactura from "../../components/ventas/ModalNuevaFactura";
import { EliminarVenta, ObtenerVentas } from "../../services/venta";
import VentaCarta from "../../components/ventas/VentaCarta";
import VentaTermica from "../../components/ventas/VentaTermica";
import ModalVerFactura from "../../components/ventas/ModalVerFactura";

// Status badge helper
const EstadoBadge = ({ estado }) => {
  const map = {
    PAGADA: { label: "Pagada", cls: "badge-success" },
    PENDIENTE: { label: "Pendiente", cls: "badge-warning" },
    ANULADA: { label: "Anulada", cls: "badge-error" },
  };
  const s = map[estado?.toUpperCase()] || { label: estado || "—", cls: "badge-info" };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

const Facturas = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [facturasPorPagina] = useState(8);
  const [filtro, setFiltro] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [facturaParaImprimir, setFacturaParaImprimir] = useState(null);
  const [mostrarModalImprimirCarta, setMostrarModalImprimirCarta] = useState(false);
  const [mostrarModalImprimirTermica, setMostrarModalImprimirTermica] = useState(false);
  const [menuImpresion, setMenuImpresion] = useState({ abierto: false, id: null });
  const [verFactura, setVerFactura] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mostrarDialogoAnular, setMostrarDialogoAnular] = useState(false);
  const [mostrarNuevaFactura, setMostrarNuevaFactura] = useState(false);

  const facturasFiltradas = facturas.filter(
    (f) =>
      f.numeroVenta?.toString().includes(filtro) ||
      f.empleado?.toLowerCase().includes(filtro.toLowerCase()) ||
      f.cliente?.toLowerCase().includes(filtro.toLowerCase()) ||
      f.sucursal?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);
  const desde = (paginaActual - 1) * facturasPorPagina;
  const facturasPaginadas = facturasFiltradas.slice(desde, desde + facturasPorPagina);

  useEffect(() => { obtenerFacturas(); }, []);

  const obtenerFacturas = async () => {
    try {
      setCargando(true);
      const res = await ObtenerVentas();
      if (res.success) setFacturas(res.data);
    } catch {
      toast.error("Error al cargar las ventas.");
    } finally {
      setCargando(false);
    }
  };

  const confirmarAnulacion = (factura) => {
    setFacturaSeleccionada(factura);
    setMostrarDialogoAnular(true);
  };

  const handleAnularFactura = async () => {
    try {
      const response = await EliminarVenta(facturaSeleccionada.idVenta);
      if (!response.success) throw new Error();
      setFacturas((prev) => prev.filter((f) => f.idVenta !== facturaSeleccionada.idVenta));
      toast.success(`Venta #${facturaSeleccionada.numeroVenta} anulada.`);
      setMostrarDialogoAnular(false);
    } catch {
      toast.error("Error al anular la venta.");
    }
  };

  const handleImprimir = (tipo, factura) => {
    setMenuImpresion({ abierto: false, id: null });
    setFacturaParaImprimir(factura);
    if (tipo === "carta") {
      setMostrarModalImprimirCarta(true);
    } else {
      setMostrarModalImprimirTermica(true);
    }
  };

  const imprimirFactura = () => {
    const contenido = document.getElementById("contenido-impresion")?.innerHTML;
    if (!contenido) return;
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, { position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0" });
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<html><head><title>Factura</title><style>body{font-family:Arial,sans-serif;margin:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:center}@page{size:A4;margin:20mm}</style></head><body>${contenido}</body></html>`);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  const imprimirTermica = () => {
    const contenido = document.getElementById("contenido-termica")?.innerHTML;
    if (!contenido) return;
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, { position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0" });
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<html><head><title>Ticket</title><style>body{font-family:'Courier New',monospace;margin:0;padding:8px;width:72mm;font-size:12px}h2{font-size:14px;margin:4px 0;text-align:center}p{margin:2px 0}.detalle-item{display:flex;justify-content:space-between;font-size:11px}.total{font-weight:bold;font-size:13px;display:flex;justify-content:space-between;border-top:1px dashed #000;padding-top:4px;margin-top:4px}hr{border:none;border-top:1px dashed #000;margin:6px 0}.footer{text-align:center;font-size:11px;margin-top:8px}@page{size:80mm auto;margin:0}</style></head><body>${contenido}</body></html>`);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  useEffect(() => {
    const handleClick = () => {
      if (menuImpresion.abierto) setMenuImpresion({ abierto: false, id: null });
    };
    if (menuImpresion.abierto) {
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [menuImpresion.abierto]);

  return (
    <Layout>
      <div className="p-6 md:p-8 animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <IoSearchOutline
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              type="text"
              placeholder="Buscar por N°, empleado, cliente..."
              value={filtro}
              onChange={(e) => { setFiltro(e.target.value); setPaginaActual(1); }}
              className="pl-9 pr-4 py-2.5 rounded-xl text-sm w-full sm:w-72 focus:outline-none transition-all"
              style={{
                border: "1.5px solid var(--color-border)",
                background: "white",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--brand-primary)";
                e.target.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            onClick={() => setMostrarNuevaFactura(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #2a5298)",
              boxShadow: "0 4px 12px rgba(30,58,95,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,58,95,0.4)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,58,95,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <IoAddCircleOutline className="w-5 h-5" />
            Nueva Venta
          </button>
        </div>

        {/* Table Card */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            background: "white",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Venta</th>
                  <th>Empleado</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Sucursal</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-primary)" }}>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Cargando ventas...</span>
                      </div>
                    </td>
                  </tr>
                ) : facturasPaginadas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <HiOutlineDocumentText className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        {filtro ? "Sin resultados para tu búsqueda." : "No hay ventas registradas."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  facturasPaginadas.map((factura) => (
                    <tr key={factura.idVenta}>
                      <td>
                        <span className="font-semibold" style={{ color: "var(--brand-primary)" }}>
                          #{factura.numeroVenta}
                        </span>
                      </td>
                      <td>{factura.empleado}</td>
                      <td>{factura.cliente}</td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{factura.fecha}</td>
                      <td>
                        <span className="font-semibold">C$ {factura.total?.toFixed(2)}</span>
                      </td>
                      <td>
                        <EstadoBadge estado={factura.estado} />
                      </td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{factura.sucursal}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1 relative">
                          <button
                            onClick={() => confirmarAnulacion(factura)}
                            className="p-2 rounded-lg transition-colors"
                            title="Anular venta"
                            style={{ color: "var(--color-error)" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-error-bg)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <IoTrashOutline className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setVerFactura(factura)}
                            className="p-2 rounded-lg transition-colors"
                            title="Ver detalle"
                            style={{ color: "var(--brand-primary-light)" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(42,82,152,0.08)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <IoEyeOutline className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuImpresion((prev) =>
                                prev.abierto && prev.id === factura.idVenta
                                  ? { abierto: false, id: null }
                                  : { abierto: true, id: factura.idVenta }
                              );
                            }}
                            className="p-2 rounded-lg transition-colors"
                            title="Imprimir"
                            style={{ color: "var(--color-text-secondary)" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-2)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <IoPrintOutline className="w-4 h-4" />
                          </button>

                          {/* Print dropdown */}
                          {menuImpresion.abierto && menuImpresion.id === factura.idVenta && (
                            <div
                              className="absolute right-0 top-full mt-1 rounded-xl border overflow-hidden z-50"
                              style={{
                                background: "white",
                                borderColor: "var(--color-border)",
                                boxShadow: "var(--shadow-lg)",
                                minWidth: "160px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                                style={{ color: "var(--color-text-primary)" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-2)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                onClick={() => handleImprimir("térmica", factura)}
                              >
                                <IoPrintOutline className="w-4 h-4" /> Impresora térmica
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                                style={{ color: "var(--color-text-primary)" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-2)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                onClick={() => handleImprimir("carta", factura)}
                              >
                                <IoPrintOutline className="w-4 h-4" /> Formato carta
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPaginas > 1 && (
            <div
              className="flex items-center justify-between px-6 py-3 border-t"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
            >
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Mostrando {desde + 1}–{Math.min(desde + facturasPorPagina, facturasFiltradas.length)} de {facturasFiltradas.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                  style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                >
                  Anterior
                </button>

                {(() => {
                  const pages = [];
                  const range = 2; // Number of pages to show on each side
                  for (let i = 1; i <= totalPaginas; i++) {
                    if (i === 1 || i === totalPaginas || (i >= paginaActual - range && i <= paginaActual + range)) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setPaginaActual(i)}
                          className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: paginaActual === i ? "var(--brand-primary)" : "transparent",
                            color: paginaActual === i ? "white" : "var(--color-text-secondary)",
                            border: paginaActual === i ? "none" : "1px solid var(--color-border)",
                          }}
                        >
                          {i}
                        </button>
                      );
                    } else if (i === paginaActual - range - 1 || i === paginaActual + range + 1) {
                      pages.push(<span key={i} className="px-1 text-slate-400">...</span>);
                    }
                  }
                  return pages;
                })()}

                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-40"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={mostrarDialogoAnular} onOpenChange={setMostrarDialogoAnular}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Anular esta venta?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-center" style={{ color: "var(--color-text-secondary)" }}>
              Estás a punto de anular la venta{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                #{facturaSeleccionada?.numeroVenta}
              </strong>
              . Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setMostrarDialogoAnular(false)}
                className="px-5 py-2 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAnularFactura}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
                }}
              >
                Sí, anular
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={mostrarModalImprimirCarta} onOpenChange={setMostrarModalImprimirCarta}>
        <DialogContent className="max-w-[850px] p-0 max-h-[90vh] overflow-auto">
          <div className="flex flex-col items-center p-6">
            <h2 className="text-lg font-bold mb-4">Vista previa — Formato Carta</h2>
            {facturaParaImprimir ? (
              <div id="area-impresion">
                <VentaCarta venta={facturaParaImprimir} modoImpresion={true} />
              </div>
            ) : (
              <p className="text-red-500">No se pudo cargar la venta.</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarModalImprimirCarta(false)}
                className="px-5 py-2 rounded-xl text-sm font-medium border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                Cerrar
              </button>
              <button
                onClick={imprimirFactura}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white"
                style={{
                  background: "linear-gradient(135deg, #059669, #047857)",
                  boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
                }}
              >
                🖨️ Imprimir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thermal Print Modal */}
      <Dialog open={mostrarModalImprimirTermica} onOpenChange={setMostrarModalImprimirTermica}>
        <DialogContent className="max-w-[420px] p-0 max-h-[90vh] overflow-auto">
          <div className="flex flex-col items-center p-6">
            <h2 className="text-lg font-bold mb-4">Vista previa — Formato Térmica</h2>
            {facturaParaImprimir ? (
              <div id="contenido-termica">
                <VentaTermica venta={facturaParaImprimir} modoPreview={true} />
              </div>
            ) : (
              <p className="text-red-500">No se pudo cargar la venta.</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarModalImprimirTermica(false)}
                className="px-5 py-2 rounded-xl text-sm font-medium border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                Cerrar
              </button>
              <button
                onClick={imprimirTermica}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white"
                style={{
                  background: "linear-gradient(135deg, #059669, #047857)",
                  boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
                }}
              >
                🖨️ Imprimir Ticket
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ModalNuevaFactura
        mostrarNuevaFactura={mostrarNuevaFactura}
        setMostrarNuevaFactura={setMostrarNuevaFactura}
        setFacturas={setFacturas}
        facturas={facturas}
      />

      {verFactura && (
        <ModalVerFactura factura={verFactura} setMostrarFactura={setVerFactura} />
      )}
    </Layout>
  );
};

export default Facturas;
