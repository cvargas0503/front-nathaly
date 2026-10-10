import axiosConfig from '../lib/axios';
export const obtenerCategorias = async () => {

        const response = await axiosConfig.get('/categorias/');
        return response.data;

}
export const crearCategoria = async (categoria) => {

        const response = await axiosConfig.post('/categorias/', categoria);
        return response.data;

}

export const editarCategoria = async (id, categoria) => {

        console.log("Editar categoria", id, categoria);
        const response = await axiosConfig.put(`/categorias/${id}`, categoria);
        return response.data;

}
export const eliminarCategoria = async (ids) => {

        console.log("Editar categoria", ids);
        const response = await axiosConfig.delete(`/categorias/`, {data: { ids }});
        return response.data;

}
