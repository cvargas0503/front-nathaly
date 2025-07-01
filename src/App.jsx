import Login from './pages/auth/login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/dashboard'
import ProtectedRoute from './components/auth/protectedRoute'
import { AuthProvider } from './context/authContext'
import Productos from './pages/catalogos/productos'
import { SidebarProvider } from './context/sidebarContext'
import Proveedores from './pages/catalogos/proveedores'
import Categorias from './pages/catalogos/categorias'
import Marcas from './pages/catalogos/marcas'
import Lineas from './pages/catalogos/lineas'
import Precios from './pages/catalogos/precios'
import Clientes from './pages/catalogos/clientes'
import Facturas from './pages/factura/Facturas'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompraFormulario from './pages/inventario/Compra'
import VerCompras from './pages/inventario/Vistacompras'
import Kardex from './pages/inventario/Kardex'
import TrasladoBodega from './pages/inventario/TransladoBodega'
import VistaTraslados from './pages/inventario/VistaTraslados'
import Pedidos from './pages/factura/Pedidos'
import Home from './pages/Home'
import SucursalesPage from './pages/catalogos/sucursales'
import Empleados from './pages/catalogos/empleados'
import Usuarios from './pages/seguridad/usuarios'
import Permisos from './pages/seguridad/Permisos'
import NotFound from './pages/404'
import ArqueoCaja from './pages/caja/ArqueoCaja'
import Cajas from './pages/caja/Cajas'
import PagoVentas from './pages/caja/PagoVentas'
import MovimientoCaja from './pages/caja/MovimientoCaja'
import RegistroCaja from './pages/caja/IngresoEgreso'
function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          style={{ zIndex: 9999 }}
        />
        <Router>
          <Routes>
            <Route path="/login"
              element={<Login />}
            />
            <Route path="/dashboard"
              element={
                <ProtectedRoute permisoRequerido="ver_dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/"
              element={
                <ProtectedRoute>
                  {/* <Navbar /> */}
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/productos"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_PRODUCTOS">
                  {/* <Navbar /> */}
                  <Productos />
                </ProtectedRoute>
              }
            />
            <Route path="/sucursales"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_SUCURSALES">
                  {/* <Navbar /> */}
                  <SucursalesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/empleados"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_EMPLEADOS">
                  {/* <Navbar /> */}
                  <Empleados />
                </ProtectedRoute>
              }
            />
            <Route path="/usuarios"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_USUARIOS">
                  {/* <Navbar /> */}
                  <Usuarios />
                </ProtectedRoute>
              }
            />
            <Route path="/permisos"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_PERMISOS">
                  {/* <Navbar /> */}
                  <Permisos />
                </ProtectedRoute>
              }
            />
            <Route path="/proveedores"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_PROVEEDORES">
                  {/* <Navbar /> */}
                  <Proveedores />
                </ProtectedRoute>
              }
            />
            <Route path="/nueva-compra"
              element={
                <ProtectedRoute permisoRequerido="NUEVA_COMPRA">
                  {/* <Navbar /> */}
                  <CompraFormulario />
                </ProtectedRoute>
              }
            />

            <Route path="/ver-compras"
              element={
                <ProtectedRoute permisoRequerido="VER_COMPRAS">
                  {/* <Navbar /> */}
                  <VerCompras />
                </ProtectedRoute>
              }
            />
            <Route path="/nuevo-traslado"
              element={
                <ProtectedRoute permisoRequerido="NUEVO_TRASLADO">
                  {/* <Navbar /> */}
                  <TrasladoBodega />
                </ProtectedRoute>
              }
            />
            <Route path="/traslados"
              element={
                <ProtectedRoute permisoRequerido="VER_TRASLADOS">
                  {/* <Navbar /> */}
                  <VistaTraslados />
                </ProtectedRoute>
              }
            />
            <Route path="/kardex"
              element={
                <ProtectedRoute permisoRequerido="VER_KARDEX">
                  {/* <Navbar /> */}
                  <Kardex />
                </ProtectedRoute>
              }
            />



            <Route path="/marcas"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_MARCAS">
                  {/* <Navbar /> */}
                  <Marcas />
                </ProtectedRoute>
              }
            />
            <Route path="/categorias"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_CATEGORIAS">
                  {/* <Navbar /> */}
                  <Categorias />
                </ProtectedRoute>
              }
            />
            <Route path="/lineas"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_LINEAS">
                  {/* <Navbar /> */}
                  <Lineas />
                </ProtectedRoute>
              }
            />
            <Route path="/precios"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_PRECIOS">
                  {/* <Navbar /> */}
                  <Precios />
                </ProtectedRoute>
              }
            />
            <Route path="/clientes"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_CLIENTES">
                  {/* <Navbar /> */}
                  <Clientes />
                </ProtectedRoute>
              }
            />
            <Route path="/facturas"
              element={
                <ProtectedRoute permisoRequerido="VER_VENTAS">
                  {/* <Navbar /> */}
                  <Facturas />
                </ProtectedRoute>
              }
            />
            <Route path="/pedidos"
              element={
                <ProtectedRoute permisoRequerido="VER_PEDIDOS">
                  {/* <Navbar /> */}
                  <Pedidos />
                </ProtectedRoute>
              }
            />

            {/* <Route path="/cajas"
              element={
                <ProtectedRoute permisoRequerido="GESTIONAR_CAJAS">
                  <Cajas />
                </ProtectedRoute>
              }
            /> */}
            <Route path="/arqueo-caja"
              element={
                <ProtectedRoute permisoRequerido="VER_PEDIDOS">
                  {/* <Navbar /> */}
                  <ArqueoCaja />
                </ProtectedRoute>
              }
            />
            <Route path="/ventas-sin-pagar"
              element={
                <ProtectedRoute permisoRequerido="PAGAR_VENTAS">
                  {/* <Navbar /> */}
                  <PagoVentas />
                </ProtectedRoute>
              }
            />
             <Route path="/movimientos-caja"
              element={
                <ProtectedRoute permisoRequerido="VER_MOVIMIENTOS_CAJA">
                  {/* <Navbar /> */}
                  <MovimientoCaja />
                </ProtectedRoute>
              }
            />
            <Route path="/nuevo-movimiento-caja"
              element={
                <ProtectedRoute permisoRequerido="NUEVO_MOVIMIENTO_CAJA">
                  {/* <Navbar /> */}
                  <RegistroCaja />
                </ProtectedRoute>
              }
            />
            <Route path="*"
              element={
                <NotFound />
              }
            />
          </Routes>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App
