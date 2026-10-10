import axiosConfig from '../lib/axios';
export const obtenerPrecios = async () => {

        const response = await axiosConfig.get('/precios/');
        return response.data;

}
export const crearPrecio = async (precio) => {

        const response = await axiosConfig.post('/precios/', precio);
        return response.data;

}

export const editarPrecio = async (id, precio) => {

        console.log("Editar precio", id, precio);
        const response = await axiosConfig.put(`/precios/${id}`, precio);
        return response.data;

}
export const eliminarPrecio = async (ids) => {

        console.log("Editar precio", ids);
        const response = await axiosConfig.delete(`/precios/`, {data: { ids }});
        return response.data;

}
