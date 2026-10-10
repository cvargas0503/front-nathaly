# Tiendas Nathaly — Frontend

Aplicación React y Vite para inventario, ventas, compras, caja, reportes, devoluciones y consultas de auditoría.

## Desarrollo

1. Instalar Node.js 24 y ejecutar `npm ci`.
2. Copiar `.env.example` a `.env`.
3. Configurar `VITE_API_URL` con la URL completa de la API, incluyendo `/api/v1`.
4. Iniciar el backend y ejecutar `npm run dev`.

El cliente HTTP y las imágenes de productos y sucursales comparten la misma configuración. Si no se define `VITE_API_URL`, se utiliza `/api/v1` en el mismo origen; el servidor debe redirigir esa ruta y `/uploads` al backend.

Las variables `VITE_*` son públicas y quedan incorporadas al compilar. Nunca colocar contraseñas de base de datos ni claves JWT en ellas. El backend debe permitir el origen del frontend en `CORS_ORIGINS` para las cookies de autenticación.

## Validación y publicación

- `npm run lint`: comprobaciones estáticas de JavaScript y React.
- `npm run build`: genera los archivos de producción en `dist`.
- `npm run preview`: vista local de la compilación.

Configurar `VITE_API_URL` antes de compilar y publicar `dist` en un servidor con soporte de rutas SPA (fallback a `index.html`). `.env`, dependencias y archivos compilados quedan fuera de Git.

El backend contiene la [documentación de endpoints](https://github.com/cvargas0503/nathaly-backend/blob/main/docs/api-endpoints.md) y la migración necesaria para los módulos nuevos. Ver [las funcionalidades incorporadas](docs/modernizacion.md).

Las comprobaciones conservan advertencias de hooks y Fast Refresh; la compilación también advierte del tamaño del paquete principal. La integración funcional requiere una base SQL Server preparada.
