import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import { useSidebar } from "../../context/sidebarContext";
import { useAuth } from "../../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineBell, HiOutlineSearch } from "react-icons/hi";
import { obtenerNotificaciones, marcarNotificacionLeida } from "../../services/notificaciones";
import { busquedaGlobal } from "../../services/busqueda";

const routeNames = {
  "/": "Inicio",
  "/dashboard": "Dashboard",
  "/productos": "Productos",
  "/proveedores": "Proveedores",
  "/marcas": "Marcas",
  "/lineas": "Líneas",
  "/categorias": "Categorías",
  "/precios": "Lista de Precios",
  "/clientes": "Clientes",
  "/empleados": "Empleados",
  "/sucursales": "Sucursales",
  "/kardex": "Kardex",
  "/nueva-compra": "Nueva Compra",
  "/ver-compras": "Ver Compras",
  "/nuevo-traslado": "Nuevo Traslado",
  "/traslados": "Consultar Traslados",
  "/facturas": "Ventas",
  "/pedidos": "Pedidos",
  "/arqueo-caja": "Arqueo de Caja",
  "/nuevo-movimiento-caja": "Ingreso / Egreso",
  "/ventas-sin-pagar": "Pagar Ventas",
  "/movimientos-caja": "Movimientos de Caja",
  "/usuarios": "Usuarios",
  "/permisos": "Permisos",
  "/reportes": "Reportes",
  "/devoluciones": "Devoluciones",
  "/auditoria": "Auditoría",
};

const Layout = ({ children }) => {
  const { expanded } = useSidebar();
  const { usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageName = routeNames[location.pathname] || "Sistema";
  const initials = usuario?.login ? usuario.login.slice(0, 2).toUpperCase() : "UN";
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-NI", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Notifications
  const [notifs, setNotifs] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Global search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    obtenerNotificaciones().then((r) => {
      if (r.success) { setNotifs(r.data); setNoLeidas(r.noLeidas || 0); }
    }).catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await marcarNotificacionLeida(id);
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      setNoLeidas((prev) => Math.max(0, prev - 1));
    } catch { /* Optional data is unavailable; retain the current view. */ }
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (q.length < 2) { setSearchResults(null); setShowSearch(false); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await busquedaGlobal(q);
        if (res.success) { setSearchResults(res.data); setShowSearch(true); }
      } catch { /* Optional data is unavailable; retain the current view. */ }
    }, 400);
  };

  const navigateSearch = (path) => { navigate(path); setShowSearch(false); setSearchQuery(""); };

  const tipoIconColors = {
    stock_bajo: "#f59e0b",
    pago_pendiente: "#6366f1",
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0" style={{ marginLeft: expanded ? "260px" : "72px", transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}>
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 border-b flex-shrink-0" style={{ height: "60px", background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-sm)", position: "sticky", top: 0, zIndex: 20 }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: "linear-gradient(to bottom, #f59e0b, #d97706)" }} />
            <h1 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>{pageName}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
              <input type="text" placeholder="Buscar..." value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults && setShowSearch(true)}
                className="pl-9 pr-4 py-2 rounded-xl text-sm w-56 focus:outline-none focus:w-72 transition-all"
                style={{ border: "1.5px solid var(--color-border)", background: "var(--color-surface-2)" }} />
              {showSearch && searchResults && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border overflow-hidden z-50" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-lg)" }}>
                  {searchResults.totalResultados === 0 ? (
                    <p className="p-4 text-sm text-center" style={{ color: "var(--color-text-muted)" }}>Sin resultados</p>
                  ) : (
                    <div className="max-h-72 overflow-y-auto">
                      {searchResults.productos?.length > 0 && (
                        <div><p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Productos</p>
                          {searchResults.productos.map((p) => (
                            <button key={p.id} onClick={() => navigateSearch("/productos")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{p.codigo} — {p.descripcion}</button>
                          ))}
                        </div>
                      )}
                      {searchResults.clientes?.length > 0 && (
                        <div><p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Clientes</p>
                          {searchResults.clientes.map((c) => (
                            <button key={c.id} onClick={() => navigateSearch("/clientes")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{c.nombre}</button>
                          ))}
                        </div>
                      )}
                      {searchResults.facturas?.length > 0 && (
                        <div><p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Facturas</p>
                          {searchResults.facturas.map((f) => (
                            <button key={f.id} onClick={() => navigateSearch("/facturas")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{f.numero} — {f.cliente}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-sm hidden lg:block" style={{ color: "var(--color-text-muted)" }}>{dateStr}</span>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <HiOutlineBell className="w-5 h-5" />
                {noLeidas > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "#ef4444", minWidth: "18px", height: "18px" }}>{noLeidas}</span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border overflow-hidden z-50" style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-lg)" }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Notificaciones</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="p-4 text-sm text-center" style={{ color: "var(--color-text-muted)" }}>Sin notificaciones</p>
                    ) : notifs.map((n) => (
                      <button key={n.id} onClick={() => handleMarkRead(n.id)}
                        className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-gray-50"
                        style={{ borderColor: "var(--color-border)", background: n.leida ? "transparent" : "rgba(99,102,241,0.04)" }}>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.leida ? "transparent" : (tipoIconColors[n.tipo] || "#6366f1") }} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{n.titulo}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{n.descripcion}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>{initials}</div>
              <span className="text-sm font-medium hidden md:block" style={{ color: "var(--color-text-secondary)" }}>{usuario?.login || "Usuario"}</span>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
