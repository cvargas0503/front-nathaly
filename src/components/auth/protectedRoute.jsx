import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import NoAutorizado from "../../pages/NoAutorizado";
import CargandoComponent from "../general/CargandoComponent";

export default function ProtectedRoute({ children, permisoRequerido }) {
  const { usuario, loading } = useAuth();

  if (loading) return <CargandoComponent/>;

  if (!usuario) return <Navigate to="/login" />;

  if (permisoRequerido && !usuario?.permisos?.includes(permisoRequerido)) {
    return <NoAutorizado/>;
  }

  return children;
}