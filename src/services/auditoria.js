import axiosConfig from '../lib/axios';

export const obtenerAuditoria = async (entidad, desde, hasta) => {

    const params = {};
    if (entidad) params.entidad = entidad;
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    const response = await axiosConfig.get('/auditoria', { params });
    return response.data;

};
