import axiosConfig from '../lib/axios';
export const guardarCompra = async (compra) => {

        const response = await axiosConfig.post('/compras/', compra);
        return response.data;

}

export const ObtenerCompras = async () => {

        const response = await axiosConfig.get('/compras/');
        return response.data;

}
