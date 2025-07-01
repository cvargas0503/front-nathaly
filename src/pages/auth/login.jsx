import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingComponent from "../../components/auth/loadingComponent";
import { useAuth } from "../../context/authContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(Number(localStorage.getItem("intentosFallidos")) || 0);
  const [bloqueado, setBloqueado] = useState(localStorage.getItem("bloqueado") === "true");

  const { setUsuario } = useAuth();
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bloqueado) {
      Swal.fire({
        icon: "error",
        title: "Cuenta bloqueada",
        text: "Has excedido los 3 intentos fallidos. Contacta al administrador o inténtalo más tarde.",
        confirmButtonColor: "#2C3E50",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await login(user);
      console.log(response)
      if (response.success) {
          localStorage.removeItem("intentosFallidos");
          localStorage.removeItem("bloqueado");
          setUsuario(response.usuario);
          navigate("/");
      } else {
        manejarIntentoFallido(response.message);
      }
    } catch (error) {
      manejarIntentoFallido(error.response?.data?.message || "Ocurrió un error al iniciar sesión");
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
        Swal.fire({
            icon: "error",
            title: "Cuenta bloqueada",
            text: "Has excedido los 3 intentos fallidos. Contacta al administrador o inténtalo más tarde.",
            confirmButtonColor: "#2C3E50",
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `${mensaje} (Intentos fallidos: ${nuevosIntentos}/3)`,
            confirmButtonColor: "#2C3E50",
        });
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4">
      {loading && <LoadingComponent />}
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-2">Sistema de Facturación e Inventarios</h1>
        <p className="text-center text-sm text-[#34495E] mb-6">Ingresa tus credenciales para acceder al sistema</p>
        <Card className="bg-white border-none shadow-none">
          <CardContent className="space-y-9">
            <div className="space-y-1">
              <Label htmlFor="usuario" className="text-[#2C3E50]">Usuario</Label>
              <Input
                id="usuario"
                placeholder="Ingrese su usuario"
                className="bg-[#ECF0F1] focus:ring-2 focus:ring-[#2C3E50] pt-5 pb-5"
                value={user.login}
                onChange={(e) => handleChange("login", e.target.value)}
                disabled={loading || bloqueado}
              />
            </div>
            <div className="space-y-1 relative">
              <Label htmlFor="contrasena" className="text-[#2C3E50]">Contraseña</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="contrasena"
                placeholder="Ingrese su contraseña"
                className="bg-[#ECF0F1] pr-10 focus:ring-2 focus:ring-[#2C3E50] pt-5 pb-5"
                value={user.password}
                onChange={(e) => handleChange("password", e.target.value)}
                autoComplete="current-password"
                disabled={loading || bloqueado}
              />
              <div
                className="absolute right-3 top-7 cursor-pointer text-[#2C3E50]"
                onClick={() => !loading && setShowPassword((prev) => !prev)}
                style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <Button
              className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white rounded-xl py-6 text-base font-semibold"
              onClick={handleSubmit}
              disabled={loading || bloqueado}
            >
              Ingresar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
