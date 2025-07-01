import React from "react";

const CargandoComponent = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl shadow-lg h-[100vh]">
            <div className="relative flex items-center justify-center mb-4">
                <span className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-400 via-purple-400 to-blue-400 animate-pulse opacity-60"></span>
                <svg
                    className="w-12 h-12 text-indigo-500 animate-spin"
                    fill="none"
                    viewBox="0 0 48 48"
                >
                    <circle
                        className="opacity-30"
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="6"
                    />
                    <path
                        d="M44 24c0-11.046-8.954-20-20-20"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="text-purple-500"
                    />
                </svg>
            </div>
            <span className="text-xl font-semibold text-indigo-700 tracking-wide animate-bounce">
                Cargando...
            </span>
        </div>
    );
};

export default CargandoComponent;