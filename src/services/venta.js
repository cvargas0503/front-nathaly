import axiosConfig from '../lib/axios';
export const NuevaVenta = async (form) => {
    try {
        const response = await axiosConfig.post('/ventas/', form);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ObtenerVentas = async () => {
    try {
        const response = await axiosConfig.get('/ventas/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ObtenerVentasPendientes = async () => {
    try {
        const response = await axiosConfig.get('/ventas/ventas-pendientes');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const EliminarVenta = async (id) => {
    try {
        const response = await axiosConfig.delete('/ventas/' + id);
        return response.data;
    } catch (error) {
        throw error;
    }    
}