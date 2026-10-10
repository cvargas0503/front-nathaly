import React, { useState, useEffect } from "react";

import Layout from "../../components/general/layout";
import { obtenerResumen, obtenerActividadReciente } from "../../services/dashboard";
import { toast } from "react-toastify";
import {
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineShoppingCart,
  HiOutlineArrowSmRight,
} from "react-icons/hi";

const StatCard = ({ icon: Icon, title, value, color, bg }) => (
  <div
    className="rounded-2xl p-5 border transition-all duration-200 cursor-default"
    style={{
      background: "white",
      borderColor: "var(--color-border)",
      boxShadow: "var(--shadow-sm)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: bg }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
      {value}
    </p>
    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
      {title}
    </p>
  </div>
);

const tipoIcons = {
  venta: HiOutlineDocumentText,
  compra: HiOutlineShoppingCart,
  pago: HiOutlineCash,
  producto: HiOutlineCube,
  usuario: HiOutlineUserGroup,
};

const tipoColors = {
  venta: { color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
  compra: { color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
  pago: { color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  producto: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  usuario: { color: "#ec4899", bg: "rgba(236,72,153,0.08)" },
};

const Dashboard = () => {

  const [resumen, setResumen] = useState(null);
  const [actividad, setActividad] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resRes, actRes] = await Promise.allSettled([
        obtenerResumen(),
        obtenerActividadReciente(),
      ]);
      if (resRes.status === "fulfilled" && resRes.value.success) {
        setResumen(resRes.value.data);
      }
      if (actRes.status === "fulfilled" && actRes.value.success) {
        setActividad(actRes.value.data);
      }
    } catch {
      toast.error("Error al cargar el dashboard.");
    } finally {
      setCargando(false);
    }
  };

  const formatCurrency = (n) =>
    `C$ ${(n || 0).toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Simple bar chart using CSS
  const maxVenta = resumen?.ventasSemana?.length
    ? Math.max(...resumen.ventasSemana.map((d) => d.total), 1)
    : 1;

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in-up">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={HiOutlineDocumentText}
            title="Ventas del mes"
            value={cargando ? "..." : formatCurrency(resumen?.ventasMes)}
            color="#6366f1"
            bg="rgba(99,102,241,0.1)"
          />
          <StatCard
            icon={HiOutlineCube}
            title="Productos activos"
            value={cargando ? "..." : (resumen?.productosActivos ?? 0).toLocaleString()}
            color="#0ea5e9"
            bg="rgba(14,165,233,0.1)"
          />
          <StatCard
            icon={HiOutlineUserGroup}
            title="Clientes registrados"
            value={cargando ? "..." : (resumen?.clientesRegistrados ?? 0).toLocaleString()}
            color="#10b981"
            bg="rgba(16,185,129,0.1)"
          />
          <StatCard
            icon={HiOutlineCash}
            title="Saldo de caja"
            value={cargando ? "..." : formatCurrency(resumen?.saldoCaja)}
            color="#f59e0b"
            bg="rgba(245,158,11,0.1)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Weekly sales chart */}
          <div
            className="lg:col-span-3 rounded-2xl p-6 border"
            style={{
              background: "white",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 className="text-base font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
              Ventas de la Semana
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>
              Ingresos diarios de los últimos 7 días
            </p>

            {resumen?.ventasSemana?.length > 0 ? (
              <div className="flex items-end gap-2 h-40">
                {resumen.ventasSemana.map((d, i) => {
                  const pct = (d.total / maxVenta) * 100;
                  const dayLabel = new Date(d.dia + "T12:00:00").toLocaleDateString("es-NI", { weekday: "short" });
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                        {d.total > 0 ? `${(d.total / 1000).toFixed(1)}k` : "0"}
                      </span>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max(pct, 4)}%`,
                          background: "linear-gradient(to top, #6366f1, #818cf8)",
                          minHeight: "4px",
                        }}
                      />
                      <span className="text-xs capitalize" style={{ color: "var(--color-text-muted)" }}>
                        {dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40" style={{ color: "var(--color-text-muted)" }}>
                <p className="text-sm">{cargando ? "Cargando..." : "Sin datos para esta semana"}</p>
              </div>
            )}
          </div>

          {/* Activity feed */}
          <div
            className="lg:col-span-2 rounded-2xl p-6 border"
            style={{
              background: "white",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineClock className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Actividad Reciente
              </h2>
            </div>

            {actividad.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {actividad.map((item, i) => {
                  const tc = tipoColors[item.tipo] || tipoColors.venta;
                  const TipoIcon = tipoIcons[item.tipo] || HiOutlineDocumentText;
                  const hora = new Date(item.fecha).toLocaleTimeString("es-NI", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                      style={{ background: "var(--color-surface-2)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: tc.bg }}
                      >
                        <TipoIcon className="w-4 h-4" style={{ color: tc.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug" style={{ color: "var(--color-text-primary)" }}>
                          {item.descripcion}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            {item.usuario}
                          </span>
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            · {hora}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-8"
                style={{ color: "var(--color-text-muted)" }}
              >
                <HiOutlineDocumentText className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">{cargando ? "Cargando..." : "No hay actividad reciente"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
