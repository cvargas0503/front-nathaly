import axiosConfig from '../lib/axios';
export const obtenerPrecios = async () => {
    try {
        const response = await axiosConfig.get('/precios/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearPrecio = async (precio) => {
    try {
        const response = await axiosConfig.post('/precios/', precio);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarPrecio = async (id, precio) => {
    try {
        console.log("Editar precio", id, precio);
        const response = await axiosConfig.put(`/precios/${id}`, precio);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarPrecio = async (ids) => {
    try {
        console.log("Editar precio", ids);
        const response = await axiosConfig.delete(`/precios/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}