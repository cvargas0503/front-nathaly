import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout } from "../services/auth";
import { toast } from "react-toastify";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarUsuario = async () => {
    try {
      const res = await getUser();
      setUsuario(res.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUsuario(null);
      return true;
    } catch {
      toast.error("No se pudo cerrar la sesión. Inténtelo nuevamente.");
      return false;
    }
  }

  useEffect(() => {
    cargarUsuario();
  }, []);


  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
