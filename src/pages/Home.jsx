import React from 'react';
import Layout from '../components/general/layout';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import {
    HiOutlineCube,
    HiOutlineDocumentText,
    HiOutlineClipboardList,
    HiOutlineCash,
    HiOutlineShoppingCart,
    HiOutlineUserGroup,
    HiOutlineArrowRight,
} from 'react-icons/hi';

const quickLinks = [
    {
        title: "Ventas",
        desc: "Registra y consulta ventas",
        icon: HiOutlineDocumentText,
        to: "/facturas",
        gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        bg: "rgba(99,102,241,0.08)",
        perm: "VER_VENTAS",
    },
    {
        title: "Productos",
        desc: "Gestiona el catálogo de productos",
        icon: HiOutlineCube,
        to: "/productos",
        gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
        bg: "rgba(14,165,233,0.08)",
        perm: "GESTIONAR_PRODUCTOS",
    },
    {
        title: "Inventario",
        desc: "Control de stock y movimientos",
        icon: HiOutlineClipboardList,
        to: "/kardex",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        bg: "rgba(16,185,129,0.08)",
        perm: "VER_KARDEX",
    },
    {
        title: "Caja",
        desc: "Arqueos e ingresos / egresos",
        icon: HiOutlineCash,
        to: "/arqueo-caja",
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        bg: "rgba(245,158,11,0.08)",
        perm: "NUEVO_ARQUEO",
    },
    {
        title: "Pedidos",
        desc: "Gestiona órdenes de clientes",
        icon: HiOutlineShoppingCart,
        to: "/pedidos",
        gradient: "linear-gradient(135deg, #ec4899, #db2777)",
        bg: "rgba(236,72,153,0.08)",
        perm: "VER_PEDIDOS",
    },
    {
        title: "Seguridad",
        desc: "Usuarios y permisos del sistema",
        icon: HiOutlineUserGroup,
        to: "/usuarios",
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        bg: "rgba(239,68,68,0.08)",
        perm: "GESTIONAR_USUARIOS",
    },
];

const Home = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 12 ? "Buenos días" :
        hour < 18 ? "Buenas tardes" :
        "Buenas noches";

    const availableLinks = quickLinks.filter(
        (link) => !link.perm || usuario?.permisos?.includes(link.perm)
    );

    return (
        <Layout>
            <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in-up">

                {/* Welcome Banner */}
                <div
                    className="rounded-2xl p-8 mb-8 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #1e3a5f 0%, #2a5298 60%, #162d4a 100%)",
                    }}
                >
                    {/* Background decoration */}
                    <div
                        className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10"
                        style={{
                            background: "radial-gradient(circle, #f59e0b, transparent)",
                            transform: "translate(30%, -30%)",
                        }}
                    />
                    <div
                        className="absolute left-1/2 bottom-0 w-48 h-48 rounded-full opacity-5"
                        style={{
                            background: "radial-gradient(circle, #6366f1, transparent)",
                            transform: "translate(-50%, 40%)",
                        }}
                    />

                    <div className="relative z-10">
                        <p
                            className="text-sm font-medium mb-1"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                            {greeting},
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                            {usuario?.login || "Usuario"} 👋
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-base max-w-lg">
                            Bienvenido al sistema de gestión de Tiendas Nathaly. Selecciona un módulo para comenzar.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <div
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ background: "rgba(245,158,11,0.2)", color: "#fcd34d" }}
                            >
                                {usuario?.rol || "Usuario"}
                            </div>
                            <div
                                className="px-3 py-1 rounded-full text-xs"
                                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                            >
                                {now.toLocaleDateString("es-NI", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access Grid */}
                {availableLinks.length > 0 && (
                    <>
                        <h2
                            className="text-base font-semibold mb-4"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Acceso Rápido
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableLinks.map((link) => (
                                <button
                                    key={link.title}
                                    onClick={() => navigate(link.to)}
                                    className="group text-left rounded-2xl p-5 border transition-all duration-200 flex items-center gap-4 cursor-pointer"
                                    style={{
                                        background: "white",
                                        borderColor: "var(--color-border)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--shadow-md)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.borderColor = "var(--color-border-strong)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.borderColor = "var(--color-border)";
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: link.bg }}
                                    >
                                        <link.icon
                                            className="w-6 h-6"
                                            style={{
                                                background: link.gradient,
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="font-semibold text-sm"
                                            style={{ color: "var(--color-text-primary)" }}
                                        >
                                            {link.title}
                                        </p>
                                        <p
                                            className="text-xs mt-0.5 truncate"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            {link.desc}
                                        </p>
                                    </div>
                                    <HiOutlineArrowRight
                                        className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                                        style={{ color: "var(--color-text-muted)" }}
                                    />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {availableLinks.length === 0 && (
                    <div
                        className="text-center py-16 rounded-2xl"
                        style={{ background: "white", border: "1px solid var(--color-border)" }}
                    >
                        <HiOutlineUserGroup
                            className="w-12 h-12 mx-auto mb-4"
                            style={{ color: "var(--color-text-muted)" }}
                        />
                        <p
                            className="font-semibold mb-1"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Sin módulos disponibles
                        </p>
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                            No tienes permisos asignados. Contacta al administrador.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Home;
