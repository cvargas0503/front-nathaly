import axiosConfig from '../lib/axios';
export const obtenerMarcas = async () => {
    try {
        const response = await axiosConfig.get('/marcas/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearMarca = async (marca) => {
    try {
        const response = await axiosConfig.post('/marcas/', marca);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarMarca = async (id, marca) => {
    try {
        const response = await axiosConfig.put(`/marcas/${id}`, marca);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarMarca = async (ids) => {
    try {
        const response = await axiosConfig.delete(`/marcas/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}