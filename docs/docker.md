# Frontend en Docker

La imagen compila React con Node.js 24 y entrega únicamente los archivos de `dist` a Nginx sin privilegios. El contenedor escucha en `8080` de manera predeterminada. La compilación ejecuta las pruebas de identidad de solicitudes y no incorpora archivos `.env`.

```sh
docker build -t nathaly-frontend:local .
docker run --rm -p 8080:8080 --network nathaly -e API_UPSTREAM=backend:3000 nathaly-frontend:local
```

`API_UPSTREAM` es la dirección interna del backend, sin protocolo ni ruta; debe resolverse dentro de la red del contenedor. `PORT` cambia el puerto interno para servicios que lo requieran. El entrypoint oficial sustituye solamente esas dos variables en la plantilla de Nginx y conserva sus variables de petición.

La configuración predeterminada compila `VITE_API_URL=/api/v1`. Nginx entrega la SPA y reenvía `/api/` y `/uploads/` al backend conservando las rutas. Esto permite utilizar cookies de sesión bajo un mismo origen, con HTTPS en el punto de entrada del alojamiento. La dirección interna del backend y sus credenciales no se incluyen en el JavaScript público.

Se puede definir otra API pública durante la construcción con `--build-arg VITE_API_URL=https://api.example.com/api/v1`. Ese valor queda incluido en los archivos públicos; no utilizar secretos. El backend debe configurar CORS y las cookies según los orígenes empleados.

`/healthz` comprueba que Nginx responde. No prueba la conexión a SQL Server ni la autenticación: esas verificaciones corresponden al backend y a las pruebas de integración. La disponibilidad de la API sigue siendo necesaria para las funciones comerciales.

La creación de facturas envía `Idempotency-Key`. El formulario conserva la clave cuando se reintenta el mismo contenido, genera una nueva si cambia el contenido enviado y la elimina cuando se completa o se descarta el formulario. Esta protección depende de la implementación transaccional del backend y requiere un navegador en contexto seguro (HTTPS, o localhost durante el desarrollo) para `crypto.randomUUID()`.

Verificación local de código: `npm test`, `npm run lint` y `npm run build`. La construcción y ejecución de la imagen requieren un motor Docker disponible; no deben presentarse como verificadas si solamente se ejecutaron esas comprobaciones de código.
