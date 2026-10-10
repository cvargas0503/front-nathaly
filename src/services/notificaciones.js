import axiosConfig from '../lib/axios';

export const obtenerNotificaciones = async () => {

    const response = await axiosConfig.get('/notificaciones');
    return response.data;

};

export const marcarNotificacionLeida = async (id) => {

    const response = await axiosConfig.patch(`/notificaciones/${id}/leer`);
    return response.data;

};

export const obtenerAlertasStock = async (umbral) => {

    const params = {};
    if (umbral) params.umbral = umbral;
    const response = await axiosConfig.get('/notificaciones/alertas-stock', { params });
    return response.data;

};
