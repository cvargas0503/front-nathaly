# Contrato de facturación y adopción de TypeScript

El formulario ModalNuevaFactura.tsx y el servicio venta.ts describen el payload en TypeScript. npm run build incluye npm run typecheck. El proyecto conserva JS/JSX mediante allowJs/checkJs=false; no se afirma que toda la aplicación esté tipada.

POST /api/v1/ventas exige Idempotency-Key: UUID por intento lógico. El formulario conserva la clave al reintentar el mismo contenido; al cambiar el contenido crea otra clave. No usar UUID nuevo para reintentos automáticos de una misma solicitud. El control inmediato con ref impide dos envíos simultáneos y la protección persistente corresponde al backend. No se añadió reintento automático a todas las peticiones.

Primera confirmación: 201. Misma clave/datos: 200, reutilizada=true y la factura original. Misma clave/datos distintos: 409. Publicar junto con el backend y ejecutar sus migraciones 002-004 antes de usar este cliente. UUID se genera con crypto.randomUUID, que requiere contexto seguro (HTTPS o localhost).

El backend aplica permisos; las rutas de React sólo controlan la experiencia de navegación. Dashboard usa GESTIONAR_USUARIOS y arqueos VER_ARQUEOS, acordes al servidor. Validar la matriz comercial antes de producción.

Verificación: npm run lint (0 errores, 15 advertencias), npm run build y smoke test jsPDF/AutoTable. Se actualizan dependencias compatibles, se elimina html2pdf.js sin uso y se actualizan exportadores PDF. Audit final conserva un aviso alto en xlsx, sin críticos. No se acredita carga, navegadores ni revisión visual de todos los comprobantes con estas pruebas.

Los cambios se publican en feature/alineacion-arquitectura-facturacion para revisión por PR hacia main. El Git Flow develop → qa → master está configurado actualmente en el backend; no se presupone el mismo esquema en este repositorio.
