import axiosConfig from '../lib/axios';

export const busquedaGlobal = async (q) => {

    const response = await axiosConfig.get('/busqueda', { params: { q } });
    return response.data;

};
