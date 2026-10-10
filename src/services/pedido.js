import axiosConfig from '../lib/axios';
export const NuevoPedido = async (form) => {

        const response = await axiosConfig.post('/pedidos/', form);
        return response.data;

}
export const ObtenerPedidos = async () => {

        const response = await axiosConfig.get('/pedidos/');
        return response.data;

}
export const EliminarPedido = async (id) => {

        const response = await axiosConfig.delete('/pedidos/' + id);
        return response.data;

}
export const ConvertirPedido = async (id) => {

        const response = await axiosConfig.patch('/pedidos/' + id);
        return response.data;

}
