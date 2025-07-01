import axiosConfig from '../lib/axios';
export const confirmarPagoApi = async (id, data) => {
    try {
        const response = await axiosConfig.post(`/caja/movimiento-caja/pago/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerMovimientosAPI = async () => {
    try {
        const response = await axiosConfig.get(`/caja/movimiento-caja`);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const registrarMovimientoAPI = async (data) => {
    try {
        const response = await axiosConfig.post(`/caja/movimiento-caja`, data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}