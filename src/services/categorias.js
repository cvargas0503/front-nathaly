import axiosConfig from '../lib/axios';
export const obtenerCategorias = async () => {
    try {
        const response = await axiosConfig.get('/categorias/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearCategoria = async (categoria) => {
    try {
        const response = await axiosConfig.post('/categorias/', categoria);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarCategoria = async (id, categoria) => {
    try {
        console.log("Editar categoria", id, categoria);
        const response = await axiosConfig.put(`/categorias/${id}`, categoria);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarCategoria = async (ids) => {
    try {
        console.log("Editar categoria", ids);
        const response = await axiosConfig.delete(`/categorias/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}