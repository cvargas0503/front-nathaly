import React from "react";

/**
 * Inline loading spinner — used within page content areas.
 * Less intrusive than the full-screen LoadingComponent.
 */
const CargandoComponent = () => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div
                        className="w-16 h-16 rounded-full animate-spin"
                        style={{
                            border: "3px solid rgba(255,255,255,0.1)",
                            borderTopColor: "#f59e0b",
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #1e3a5f, #2a5298)" }}
                        >
                            <span className="text-white font-black text-base">N</span>
                        </div>
                    </div>
                </div>
                <span
                    className="text-sm font-medium animate-pulse"
                    style={{ color: "white" }}
                >
                    Procesando...
                </span>
            </div>
        </div>
    );
};

export default CargandoComponent;
