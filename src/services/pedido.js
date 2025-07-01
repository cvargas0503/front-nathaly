import axiosConfig from '../lib/axios';
export const NuevoPedido = async (form) => {
    try {
        const response = await axiosConfig.post('/pedidos/', form);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ObtenerPedidos = async () => {
    try {
        const response = await axiosConfig.get('/pedidos/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const EliminarPedido = async (id) => {
    try {
        const response = await axiosConfig.delete('/pedidos/' + id);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ConvertirPedido = async (id) => {
    try {
        const response = await axiosConfig.patch('/pedidos/' + id);
        return response.data;
    } catch (error) {
        throw error;
    }    
}