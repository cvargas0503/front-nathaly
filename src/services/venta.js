import axiosConfig from '../lib/axios';
export const NuevaVenta = async (form) => {

        const response = await axiosConfig.post('/ventas/', form);
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
