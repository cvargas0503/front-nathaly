import axiosConfig from '../lib/axios';

export const registrarDevolucion = async (data) => {

    const response = await axiosConfig.post('/devoluciones', data);
    return response.data;

};

export const obtenerDevoluciones = async (desde, hasta) => {

    const params = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    const response = await axiosConfig.get('/devoluciones', { params });
    return response.data;

};

export const obtenerDevolucion = async (id) => {

    const response = await axiosConfig.get(`/devoluciones/${id}`);
    return response.data;

};
