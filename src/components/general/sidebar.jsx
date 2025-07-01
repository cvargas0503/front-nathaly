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
    HiTruck
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
        links: [
            { name: "Productos", to: "/productos", icon: HiOutlineCube, perm: "GESTIONAR_PRODUCTOS" },
            { name: "Proveedores", to: "/proveedores", icon: HiOutlineTruck, perm: "GESTIONAR_PROVEEDORES" },
            { name: "Marcas", to: "/marcas", icon: HiOutlineTag, perm: "GESTIONAR_MARCAS" },
            { name: "Lineas", to: "/lineas", icon: HiOutlineNewspaper, perm: "GESTIONAR_LINEAS" },
            { name: "Categorias", to: "/categorias", icon: TbCategoryPlus, perm: "GESTIONAR_CATEGORIAS" },
            { name: "Lista de Precios", to: "/precios", icon: RiMoneyDollarCircleFill, perm: "GESTIONAR_PRECIOS" },
            { name: "Clientes", to: "/clientes", icon: BsFillPersonLinesFill, perm: "GESTIONAR_CLIENTES" },
            { name: "Empleados", to: "/empleados", icon: BsFillPersonLinesFill, perm: "GESTIONAR_EMPLEADOS" },
            { name: "Sucursales", to: "/sucursales", icon: HiUser, perm: "GESTIONAR_SUCURSALES" },
        ],
    },
    {
        title: "INVENTARIO",
        icon: HiOutlineClipboardList,
        links: [
            { name: "Kardex", to: "/kardex", icon: HiOutlineClipboardList, perm: "VER_KARDEX" },
            { name: "Nueva compra", to: "/nueva-compra", icon: HiFolderAdd, perm: "NUEVA_COMPRA" },
            { name: "Ver Compras", to: "/ver-compras", icon: HiOutlineEye, perm: "VER_COMPRAS" },
            { name: "Nuevo traslado", to: "/nuevo-traslado", icon: HiDocumentAdd, perm: "NUEVO_TRASLADO" },
            { name: "Consultar traslados", to: "/traslados", icon: HiTruck, perm: "VER_TRASLADOS" },


        ],
    },
    {
        title: "CAJA",
        icon: HiOutlineCash,
        links: [
            // { name: "Cajas disponibles", to: "/cajas", icon: BiSolidCollection, perm: "GESTIONAR_CAJAS" },
            { name: "Arqueo de caja", to: "/arqueo-caja", icon: HiOutlineCash, perm: "NUEVO_ARQUEO" },
            { name: "Ingreso / Egreso", to: "/nuevo-movimiento-caja", icon: HiOutlineCash, perm: "NUEVO_MOVIMIENTO_CAJA" },
            { name: "Pagar ventas", to: "/ventas-sin-pagar", icon: HiOutlineCash, perm: "PAGAR_VENTAS" },
            // { name: "Mostrar arqueos", to: "/arqueos", icon: HiOutlineCash, perm: "VER_ARQUEOS" },
            // { name: "Reabrir arqueo", to: "/reabrir-arqueo", icon: HiOutlineCash, perm: "REABRIR_ARQUEO" },
            { name: "Movimientos de caja", to: "/movimientos-caja", icon: HiOutlineCash, perm: "VER_MOVIMIENTOS_CAJA" },
        ],
    },
    {
        title: "FACTURA",
        icon: HiOutlineDocumentText,
        links: [
            { name: "Facturas", to: "/facturas", icon: HiOutlineDocumentText, perm: "VER_VENTAS" },
        ],
    },
    {
        title: "PEDIDOS",
        icon: HiOutlineShoppingCart,
        links: [
            { name: "Pedidos", to: "/pedidos", icon: HiOutlineShoppingCart, perm: "VER_PEDIDOS" },
        ],
    },
    {
        title: "SEGURIDAD",
        icon: HiOutlineUserGroup,
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
                    (!item.perm || usuario.permisos.includes(item.perm)) &&
                    item.name.toLowerCase().includes(search.toLowerCase())
            );
            return { ...sec, items };
        })
        .filter((sec) => sec.items.length > 0);

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-blue-900 shadow-xl flex flex-col \$
        expanded ? "w-64" : "w-20"
      }`}
        >
            {/* Header */}
            <div className="px-4 py-4 border-b border-blue-800 flex items-center justify-between">
                {expanded && (
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 rounded bg-blue-800 text-white placeholder-blue-300"
                    />
                )}
                <button onClick={() => setExpanded((e) => !e)}>
                    <HiOutlineChevronLeft
                        className={`w-6 h-6 text-blue-200 transform transition-transform \$
              expanded ? "" : "-rotate-180"
            }`}
                    />
                </button>
            </div>

            {/* Sections */}
            <nav className="flex-1 overflow-y-auto p-2">
                {filteredSections.map((sec) => (
                    <div key={sec.title} className="mb-2">
                        <button
                            onClick={() => toggle(sec.title)}
                            className="w-full flex items-center p-2 rounded text-blue-200 hover:bg-blue-800 hover:text-white"
                        >
                            <sec.icon className="w-5 h-5 mr-2" />
                            {expanded && <span className="flex-1 font-semibold">{sec.title}</span>}
                            {expanded && (
                                <HiOutlineChevronDown
                                    className={`w-4 h-4 transform transition-transform \$
                    open[sec.title] ? "rotate-180" : ""
                  }`}
                                />
                            )}
                        </button>
                        {open[sec.title] && expanded && (
                            <div className="pl-8 mt-1">
                                {sec.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        className={`block p-2 rounded mb-1 text-blue-200 hover:bg-blue-700 hover:text-white \$
                      location.pathname === item.to ? "bg-blue-600 text-white" : ""
                    }`}
                                    >
                                        <item.icon className="w-4 h-4 inline-block mr-2" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer: cerrar sesión y ejemplo de botón condicionado */}
            <div className="p-4 border-t border-blue-800">
                {/* Botón oculto según permiso */}
                {usuario.permisos.includes("ADMIN_DASHBOARD_ACCESS") && (
                    <button
                        onClick={() => navigate("/admin")}
                        className="w-full flex items-center py-2 rounded bg-green-600 text-white mb-2"
                    >
                        Admin Dashboard
                    </button>
                )}
                <button
                    onClick={() => {
                        handleLogout();
                        navigate("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded bg-red-600 text-white"
                >
                    <HiOutlineLogout className="w-5 h-5" />
                    {expanded && <span>Cerrar sesión</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;