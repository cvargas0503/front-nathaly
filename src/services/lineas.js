import axiosConfig from '../lib/axios';
export const obtenerLineas = async () => {
    try {
        const response = await axiosConfig.get('/lineas/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearLinea = async (linea) => {
    try {
        const response = await axiosConfig.post('/lineas/', linea);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarLinea = async (id, linea) => {
    try {
        console.log("Editar linea", id, linea);
        const response = await axiosConfig.put(`/lineas/${id}`, linea);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarLinea = async (ids) => {
    try {
        console.log("Editar linea", ids);
        const response = await axiosConfig.delete(`/lineas/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}