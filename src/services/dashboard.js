import axiosConfig from '../lib/axios';

export const obtenerResumen = async () => {

    const response = await axiosConfig.get('/dashboard/resumen');
    return response.data;

};

export const obtenerActividadReciente = async () => {

    const response = await axiosConfig.get('/dashboard/actividad-reciente');
    return response.data;

};
