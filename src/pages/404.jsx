import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
            <div className="text-center px-6">
                <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg mb-4 select-none">
                    404
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-2">
                    Página no encontrada
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                    Lo sentimos, la página que buscas no existe o fue movida.<br />
                    Pero no te preocupes, puedes volver al inicio.
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-indigo-500 transition-all duration-300"
                >
                    Volver al inicio
                </Link>
            </div>
            <div className="mt-12">
                <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="110" cy="60" rx="100" ry="40" fill="url(#paint0_radial_404)" opacity="0.2"/>
                    <defs>
                        <radialGradient id="paint0_radial_404" cx="0" cy="0" r="1" gradientTransform="translate(110 60) scale(100 40)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#a78bfa"/>
                            <stop offset="1" stopColor="#f472b6"/>
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}