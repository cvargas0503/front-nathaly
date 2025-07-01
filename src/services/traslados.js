import axiosConfig from '../lib/axios';
export const crearTraslado = async (data) => {
    try {
        const response = await axiosConfig.post('/traslados/', data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ObtenerTraslados = async () => {
    try {
        const response = await axiosConfig.get('/traslados/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}