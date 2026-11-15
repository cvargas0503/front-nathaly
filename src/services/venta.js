import axiosConfig from '../lib/axios';
export const NuevaVenta = async (form, idempotencyKey) => {

        if (!idempotencyKey) throw new Error('La solicitud de factura requiere una clave de idempotencia.');
        const response = await axiosConfig.post('/ventas/', form, {
                headers: { 'Idempotency-Key': idempotencyKey },
        });
        return response.data;

}
export const ObtenerVentas = async () => {

        const response = await axiosConfig.get('/ventas/');
        return response.data;

}
export const ObtenerVentasPendientes = async () => {

        const response = await axiosConfig.get('/ventas/ventas-pendientes');
        return response.data;

}
export const EliminarVenta = async (id) => {

        const response = await axiosConfig.delete('/ventas/' + id);
        return response.data;

}
