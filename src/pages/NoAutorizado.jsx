import { Link } from "react-router-dom";

export default function NoAutorizado() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg">
                <div className="text-8xl font-extrabold text-fuchsia-400 drop-shadow-lg mb-4 animate-bounce">
                    403
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide">
                    Acceso Denegado
                </h1>
                <p className="text-lg text-fuchsia-100 mb-6 text-center">
                    No tienes permisos para ver esta página.<br />
                    Si crees que esto es un error, contacta al administrador.
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                >
                    Volver al inicio
                </Link>
            </div>
            <div className="absolute bottom-8 text-fuchsia-200 text-sm opacity-70 select-none">
                &copy; {new Date().getFullYear()} Tiendas Nathaly
            </div>
        </div>
    );
}