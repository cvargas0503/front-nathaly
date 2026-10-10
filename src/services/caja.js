import axiosConfig from '../lib/axios';
export const confirmarPagoApi = async (id, data) => {

        const response = await axiosConfig.post(`/caja/movimiento-caja/pago/${id}`, data);
        return response.data;

}
export const obtenerMovimientosAPI = async () => {

        const response = await axiosConfig.get(`/caja/movimiento-caja`);
        return response.data;

}

export const registrarMovimientoAPI = async (data) => {

        const response = await axiosConfig.post(`/caja/movimiento-caja`, data);
        return response.data;

}
