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
import VerCompras from './pages/inventario/VistaCompras'
import Kardex from './pages/inventario/Kardex'
import TrasladoBodega from './pages/inventario/TransladoBodega'
import VistaTraslados from './pages/inventario/VistaTraslados'
import Pedidos from './pages/factura/Pedidos'
import Home from './pages/Home'
import SucursalesPage from './pages/catalogos/sucursales'
import Empleados from './pages/catalogos/empleados'
import Usuarios from './pages/seguridad/Usuarios'
import Permisos from './pages/seguridad/Permisos'
import NotFound from './pages/404'
import ArqueoCaja from './pages/caja/ArqueoCaja'
import Cajas from './pages/caja/Cajas'
import PagoVentas from './pages/caja/PagoVentas'
import MovimientoCaja from './pages/caja/MovimientoCaja'
import RegistroCaja from './pages/caja/IngresoEgreso'
import Reportes from './pages/reportes/Reportes'
import Devoluciones from './pages/devoluciones/Devoluciones'
import Auditoria from './pages/auditoria/Auditoria'

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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute permisoRequerido="ver_dashboard"><Dashboard /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/productos" element={<ProtectedRoute permisoRequerido="GESTIONAR_PRODUCTOS"><Productos /></ProtectedRoute>} />
            <Route path="/sucursales" element={<ProtectedRoute permisoRequerido="GESTIONAR_SUCURSALES"><SucursalesPage /></ProtectedRoute>} />
            <Route path="/empleados" element={<ProtectedRoute permisoRequerido="GESTIONAR_EMPLEADOS"><Empleados /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute permisoRequerido="GESTIONAR_USUARIOS"><Usuarios /></ProtectedRoute>} />
            <Route path="/permisos" element={<ProtectedRoute permisoRequerido="GESTIONAR_PERMISOS"><Permisos /></ProtectedRoute>} />
            <Route path="/proveedores" element={<ProtectedRoute permisoRequerido="GESTIONAR_PROVEEDORES"><Proveedores /></ProtectedRoute>} />
            <Route path="/nueva-compra" element={<ProtectedRoute permisoRequerido="NUEVA_COMPRA"><CompraFormulario /></ProtectedRoute>} />
            <Route path="/ver-compras" element={<ProtectedRoute permisoRequerido="VER_COMPRAS"><VerCompras /></ProtectedRoute>} />
            <Route path="/nuevo-traslado" element={<ProtectedRoute permisoRequerido="NUEVO_TRASLADO"><TrasladoBodega /></ProtectedRoute>} />
            <Route path="/traslados" element={<ProtectedRoute permisoRequerido="VER_TRASLADOS"><VistaTraslados /></ProtectedRoute>} />
            <Route path="/kardex" element={<ProtectedRoute permisoRequerido="VER_KARDEX"><Kardex /></ProtectedRoute>} />
            <Route path="/marcas" element={<ProtectedRoute permisoRequerido="GESTIONAR_MARCAS"><Marcas /></ProtectedRoute>} />
            <Route path="/categorias" element={<ProtectedRoute permisoRequerido="GESTIONAR_CATEGORIAS"><Categorias /></ProtectedRoute>} />
            <Route path="/lineas" element={<ProtectedRoute permisoRequerido="GESTIONAR_LINEAS"><Lineas /></ProtectedRoute>} />
            <Route path="/precios" element={<ProtectedRoute permisoRequerido="GESTIONAR_PRECIOS"><Precios /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute permisoRequerido="GESTIONAR_CLIENTES"><Clientes /></ProtectedRoute>} />
            <Route path="/facturas" element={<ProtectedRoute permisoRequerido="VER_VENTAS"><Facturas /></ProtectedRoute>} />
            <Route path="/pedidos" element={<ProtectedRoute permisoRequerido="VER_PEDIDOS"><Pedidos /></ProtectedRoute>} />
            <Route path="/arqueo-caja" element={<ProtectedRoute permisoRequerido="VER_PEDIDOS"><ArqueoCaja /></ProtectedRoute>} />
            <Route path="/ventas-sin-pagar" element={<ProtectedRoute permisoRequerido="PAGAR_VENTAS"><PagoVentas /></ProtectedRoute>} />
            <Route path="/movimientos-caja" element={<ProtectedRoute permisoRequerido="VER_MOVIMIENTOS_CAJA"><MovimientoCaja /></ProtectedRoute>} />
            <Route path="/nuevo-movimiento-caja" element={<ProtectedRoute permisoRequerido="NUEVO_MOVIMIENTO_CAJA"><RegistroCaja /></ProtectedRoute>} />
            {/* New routes */}
            <Route path="/reportes" element={<ProtectedRoute permisoRequerido="VER_VENTAS"><Reportes /></ProtectedRoute>} />
            <Route path="/devoluciones" element={<ProtectedRoute permisoRequerido="VER_VENTAS"><Devoluciones /></ProtectedRoute>} />
            <Route path="/auditoria" element={<ProtectedRoute permisoRequerido="GESTIONAR_USUARIOS"><Auditoria /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App
