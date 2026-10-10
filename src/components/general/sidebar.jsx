import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    HiOutlineChevronLeft,
    HiOutlineChevronDown,
    HiOutlineLogout,
    HiOutlineViewGrid,
    HiOutlineClipboardList,
    HiOutlineUserGroup,
    HiOutlineCube,
    HiOutlineTag,
    HiOutlineTruck,
    HiOutlineCash,
    HiOutlineDocumentText,
    HiOutlineNewspaper,
    HiUser,
    HiCash,
    HiOutlineShoppingCart,
    HiOutlineEye,
    HiFolderAdd,
    HiDocumentAdd,
    HiTruck,
    HiOutlineHome,
    HiOutlineSearch,
} from "react-icons/hi";
import { BiSolidCollection } from "react-icons/bi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { GrSecure } from "react-icons/gr";
import { TbCategoryPlus } from "react-icons/tb";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useSidebar } from "../../context/sidebarContext";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const sidebarSections = [
    {
        title: "CATÁLOGOS",
        icon: HiOutlineViewGrid,
        color: "text-blue-300",
        links: [
            { name: "Productos", to: "/productos", icon: HiOutlineCube, perm: "GESTIONAR_PRODUCTOS" },
            { name: "Proveedores", to: "/proveedores", icon: HiOutlineTruck, perm: "GESTIONAR_PROVEEDORES" },
            { name: "Marcas", to: "/marcas", icon: HiOutlineTag, perm: "GESTIONAR_MARCAS" },
            { name: "Líneas", to: "/lineas", icon: HiOutlineNewspaper, perm: "GESTIONAR_LINEAS" },
            { name: "Categorías", to: "/categorias", icon: TbCategoryPlus, perm: "GESTIONAR_CATEGORIAS" },
            { name: "Lista de Precios", to: "/precios", icon: RiMoneyDollarCircleFill, perm: "GESTIONAR_PRECIOS" },
            { name: "Clientes", to: "/clientes", icon: BsFillPersonLinesFill, perm: "GESTIONAR_CLIENTES" },
            { name: "Empleados", to: "/empleados", icon: BsFillPersonLinesFill, perm: "GESTIONAR_EMPLEADOS" },
            { name: "Sucursales", to: "/sucursales", icon: HiUser, perm: "GESTIONAR_SUCURSALES" },
        ],
    },
    {
        title: "INVENTARIO",
        icon: HiOutlineClipboardList,
        color: "text-emerald-300",
        links: [
            { name: "Kardex", to: "/kardex", icon: HiOutlineClipboardList, perm: "VER_KARDEX" },
            { name: "Nueva Compra", to: "/nueva-compra", icon: HiFolderAdd, perm: "NUEVA_COMPRA" },
            { name: "Ver Compras", to: "/ver-compras", icon: HiOutlineEye, perm: "VER_COMPRAS" },
            { name: "Nuevo Traslado", to: "/nuevo-traslado", icon: HiDocumentAdd, perm: "NUEVO_TRASLADO" },
            { name: "Consultar Traslados", to: "/traslados", icon: HiTruck, perm: "VER_TRASLADOS" },
        ],
    },
    {
        title: "CAJA",
        icon: HiOutlineCash,
        color: "text-amber-300",
        links: [
            { name: "Arqueo de Caja", to: "/arqueo-caja", icon: HiOutlineCash, perm: "NUEVO_ARQUEO" },
            { name: "Ingreso / Egreso", to: "/nuevo-movimiento-caja", icon: HiCash, perm: "NUEVO_MOVIMIENTO_CAJA" },
            { name: "Pagar Ventas", to: "/ventas-sin-pagar", icon: HiOutlineCash, perm: "PAGAR_VENTAS" },
            { name: "Movimientos de Caja", to: "/movimientos-caja", icon: HiOutlineClipboardList, perm: "VER_MOVIMIENTOS_CAJA" },
        ],
    },
    {
        title: "VENTAS",
        icon: HiOutlineDocumentText,
        color: "text-purple-300",
        links: [
            { name: "Ventas", to: "/facturas", icon: HiOutlineDocumentText, perm: "VER_VENTAS" },
            { name: "Pedidos", to: "/pedidos", icon: HiOutlineShoppingCart, perm: "VER_PEDIDOS" },
            { name: "Devoluciones", to: "/devoluciones", icon: HiOutlineDocumentText, perm: "VER_VENTAS" },
        ],
    },
    {
        title: "REPORTES",
        icon: HiOutlineClipboardList,
        color: "text-cyan-300",
        links: [
            { name: "Reportes", to: "/reportes", icon: HiOutlineDocumentText, perm: "VER_VENTAS" },
            { name: "Auditoría", to: "/auditoria", icon: HiOutlineClipboardList, perm: "GESTIONAR_USUARIOS" },
        ],
    },
    {
        title: "SEGURIDAD",
        icon: HiOutlineUserGroup,
        color: "text-red-300",
        links: [
            { name: "Usuarios", to: "/usuarios", icon: HiOutlineUserGroup, perm: "GESTIONAR_USUARIOS" },
            { name: "Permisos", to: "/permisos", icon: GrSecure, perm: "GESTIONAR_PERMISOS" },
        ],
    }
];

const Sidebar = () => {
    const { expanded, setExpanded } = useSidebar();
    const [open, setOpen] = useState({});
    const [search, setSearch] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { handleLogout, usuario } = useAuth();

    const toggle = (title) => {
        setOpen((o) => ({ ...o, [title]: !o[title] }));
    };

    const filteredSections = sidebarSections
        .map((sec) => {
            const items = sec.links.filter(
                (item) =>
                    (!item.perm || usuario?.permisos?.includes(item.perm)) &&
                    item.name.toLowerCase().includes(search.toLowerCase())
            );
            return { ...sec, items };
        })
        .filter((sec) => sec.items.length > 0);

    // Get user initials for avatar
    const initials = usuario?.login
        ? usuario.login.slice(0, 2).toUpperCase()
        : "UN";

    return (
        <aside
            style={{
                width: expanded ? "260px" : "72px",
                transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className="fixed top-0 left-0 h-full z-40 flex flex-col shadow-xl overflow-hidden sidebar-nav"
        >
            {/* Brand Header */}
            <div
                className="flex items-center px-4 border-b"
                style={{
                    height: "60px",
                    borderColor: "rgba(255,255,255,0.1)",
                    minHeight: "60px",
                }}
            >
                {expanded ? (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                        >
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate leading-tight">Tiendas Nathaly</p>
                            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>Sistema de Gestión</p>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto"
                        style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                    >
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                )}
                {expanded && (
                    <button
                        onClick={() => setExpanded((e) => !e)}
                        className="ml-2 p-1 rounded-md transition-colors flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        title="Colapsar menú"
                    >
                        <HiOutlineChevronLeft className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Search or Expand Button */}
            <div
                className="px-3 py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
                {expanded ? (
                    <div className="relative">
                        <HiOutlineSearch
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                        />
                        <input
                            type="text"
                            placeholder="Buscar módulo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-1"
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                borderColor: "rgba(255,255,255,0.1)",
                                focusRingColor: "rgba(245,158,11,0.5)",
                            }}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setExpanded((e) => !e)}
                        className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                        }}
                        title="Expandir menú"
                    >
                        <HiOutlineChevronLeft className="w-5 h-5 -rotate-180" />
                    </button>
                )}
            </div>

            {/* Home link */}
            <div className="px-3 pt-3">
                <Link
                    to="/"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                        location.pathname === "/"
                            ? "text-amber-400 font-semibold"
                            : "text-blue-200 hover:text-white"
                    }`}
                    style={{
                        background: location.pathname === "/" ? "rgba(245,158,11,0.15)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                        if (location.pathname !== "/") e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                        if (location.pathname !== "/") e.currentTarget.style.background = "transparent";
                    }}
                    title={!expanded ? "Inicio" : ""}
                >
                    <HiOutlineHome className="w-5 h-5 flex-shrink-0" />
                    {expanded && <span className="text-sm">Inicio</span>}
                </Link>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto px-3 py-2">
                {filteredSections.map((sec) => (
                    <div key={sec.title} className="mb-1">
                        <button
                            onClick={() => toggle(sec.title)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group"
                            style={{ color: "rgba(255,255,255,0.65)" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                            }}
                            title={!expanded ? sec.title : ""}
                        >
                            <sec.icon className={`w-5 h-5 flex-shrink-0 ${sec.color}`} />
                            {expanded && (
                                <>
                                    <span className="flex-1 text-xs font-semibold tracking-wider">{sec.title}</span>
                                    <HiOutlineChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            open[sec.title] ? "rotate-180" : ""
                                        }`}
                                    />
                                </>
                            )}
                        </button>

                        {open[sec.title] && expanded && (
                            <div className="mt-1 ml-2 pl-4 border-l" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                                {sec.items.map((item) => {
                                    const isActive = location.pathname === item.to;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150"
                                            style={{
                                                color: isActive ? "#f59e0b" : "rgba(255,255,255,0.65)",
                                                background: isActive ? "rgba(245,158,11,0.15)" : "transparent",
                                                fontWeight: isActive ? 600 : 400,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                                    e.currentTarget.style.color = "white";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background = "transparent";
                                                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                                                }
                                            }}
                                        >
                                            <item.icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{item.name}</span>
                                            {isActive && (
                                                <span
                                                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                    style={{ background: "#f59e0b" }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div
                className="p-3 border-t"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
                {/* User Info */}
                {expanded && (
                    <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                        >
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-medium truncate">{usuario?.login || "Usuario"}</p>
                            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                                {usuario?.rol || "Empleado"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Logout Button */}
                <button
                    onClick={async () => {
                        if (await handleLogout()) navigate("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                        color: "#fca5a5",
                        background: "rgba(239,68,68,0.1)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                        e.currentTarget.style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                        e.currentTarget.style.color = "#fca5a5";
                    }}
                    title={!expanded ? "Cerrar sesión" : ""}
                >
                    <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
                    {expanded && <span>Cerrar sesión</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
