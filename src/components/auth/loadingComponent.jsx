export default function LoadingComponent() {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)" }}
        >
            <div className="flex flex-col items-center gap-5">
                {/* Logo + spinner */}
                <div className="relative">
                    {/* Outer spinning ring */}
                    <div
                        className="w-20 h-20 rounded-full animate-spin"
                        style={{
                            border: "3px solid rgba(255,255,255,0.1)",
                            borderTopColor: "#f59e0b",
                            borderRightColor: "#f59e0b",
                        }}
                    />
                    {/* Inner logo */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: "linear-gradient(135deg, #1e3a5f, #2a5298)" }}
                        >
                            <span className="text-white font-black text-xl">N</span>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className="text-white font-semibold text-sm">Tiendas Nathaly</p>
                    <p
                        className="text-xs mt-0.5 animate-pulse"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                        Cargando...
                    </p>
                </div>
            </div>
        </div>
    );
}
