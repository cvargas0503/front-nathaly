import { toast } from "react-toastify";
import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, AlertCircle, Lock, User } from "lucide-react";
import { login } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(
    Number(localStorage.getItem("intentosFallidos")) || 0
  );
  const [bloqueado, setBloqueado] = useState(
    localStorage.getItem("bloqueado") === "true"
  );

  const { setUsuario } = useAuth();
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bloqueado) {
      toast.error("Cuenta bloqueada. Contacta al administrador.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(user);
      if (response.success) {
        localStorage.removeItem("intentosFallidos");
        localStorage.removeItem("bloqueado");
        setUsuario(response.usuario);
        navigate("/");
      } else {
        manejarIntentoFallido(response.message);
      }
    } catch (error) {
      manejarIntentoFallido(
        error.response?.data?.message || "Ocurrió un error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  const manejarIntentoFallido = (mensaje) => {
    const nuevosIntentos = intentosFallidos + 1;
    setIntentosFallidos(nuevosIntentos);
    localStorage.setItem("intentosFallidos", nuevosIntentos);

    if (nuevosIntentos >= 3) {
      setBloqueado(true);
      localStorage.setItem("bloqueado", "true");
      toast.error("Cuenta bloqueada por exceso de intentos.");
    } else {
      toast.warning(`${mensaje} (Intento ${nuevosIntentos} de 3)`);
    }
  };

  const intentosRestantes = 3 - intentosFallidos;

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {/* Left panel - Branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden bg-white border-r border-slate-200">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(99,102,241,0.05) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.05) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/20"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
          >
            <span className="text-white font-black text-5xl">N</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight text-slate-900">
            Tiendas Nathaly
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-md mx-auto leading-relaxed">
            Gestión inteligente de inventarios, facturación y operaciones comerciales
          </p>

          {/* Feature bullets */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              "Inventario Real-time",
              "Facturación Ágil",
              "Reportes Avanzados",
              "Multi-sucursal",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <span className="text-slate-700 text-sm font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center p-8">
        <div
          className="w-full max-w-[400px] rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
            >
              <span className="text-white font-black text-lg">N</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Tiendas Nathaly</p>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>

          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--brand-primary)" }}
            >
              Bienvenido de nuevo
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Blocked warning */}
          {bloqueado && (
            <div
              className="flex items-start gap-3 p-3 rounded-lg mb-6"
              style={{
                background: "var(--color-error-bg)",
                border: "1px solid var(--color-error-border)",
              }}
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Cuenta bloqueada</p>
                <p className="text-xs text-red-600 mt-0.5">
                  Contacta al administrador del sistema para desbloquear tu cuenta.
                </p>
              </div>
            </div>
          )}

          {/* Attempts warning */}
          {intentosFallidos > 0 && !bloqueado && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-6"
              style={{
                background: "var(--color-warning-bg)",
                border: "1px solid #fde68a",
              }}
            >
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Te quedan <strong>{intentosRestantes} intento{intentosRestantes !== 1 ? "s" : ""}</strong> antes de bloquear la cuenta.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text-primary)" }}
              >
                Usuario
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="usuario"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={user.login}
                  onChange={(e) => handleChange("login", e.target.value)}
                  disabled={loading || bloqueado}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-150 focus:outline-none"
                  style={{
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-surface-2)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--brand-primary)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
                    e.target.style.background = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "var(--color-surface-2)";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text-primary)" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="contrasena"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={user.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={loading || bloqueado}
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl text-sm transition-all duration-150 focus:outline-none"
                  style={{
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-surface-2)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--brand-primary)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
                    e.target.style.background = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "var(--color-surface-2)";
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                  onClick={() => !loading && setShowPassword((prev) => !prev)}
                  style={{ color: "var(--color-text-muted)" }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || bloqueado}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background:
                  loading || bloqueado
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #1e3a5f, #2a5298)",
                cursor: loading || bloqueado ? "not-allowed" : "pointer",
                boxShadow:
                  loading || bloqueado
                    ? "none"
                    : "0 4px 15px rgba(30,58,95,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!loading && !bloqueado) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #162d4a, #1e3a5f)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(30,58,95,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !bloqueado) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #1e3a5f, #2a5298)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(30,58,95,0.35)";
                }
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            className="text-center text-xs mt-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            &copy; {new Date().getFullYear()} Tiendas Nathaly — Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
