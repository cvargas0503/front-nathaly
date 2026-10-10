import axiosConfig from '../lib/axios';
export const crearTraslado = async (data) => {

        const response = await axiosConfig.post('/traslados/', data);
        return response.data;

}
export const ObtenerTraslados = async () => {

        const response = await axiosConfig.get('/traslados/');
        return response.data;

}
