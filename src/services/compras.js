import axiosConfig from '../lib/axios';
export const guardarCompra = async (compra) => {
    try {
        const response = await axiosConfig.post('/compras/', compra);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const ObtenerCompras = async () => {
    try {
        const response = await axiosConfig.get('/compras/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}