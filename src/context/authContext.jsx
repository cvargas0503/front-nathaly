import { createContext, useContext, useEffect, useState } from "react";
import {getUser} from "../services/auth"; 
import Cookies from "js-cookie";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarUsuario = async () => {
    try {
      const res = await getUser();
      console.log(res);
      setUsuario(res.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("Cerrando sesión");
    Cookies.remove("token");
    setUsuario(null);
    console.log(Cookies)
      console.log(Cookies.get("token"));
    Cookies.remove("token");
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