import axiosConfig from '../lib/axios';
export const obtenerMarcas = async () => {

        const response = await axiosConfig.get('/marcas/');
        return response.data;

}
export const crearMarca = async (marca) => {

        const response = await axiosConfig.post('/marcas/', marca);
        return response.data;

}

export const editarMarca = async (id, marca) => {

        const response = await axiosConfig.put(`/marcas/${id}`, marca);
        return response.data;

}
export const eliminarMarca = async (ids) => {

        const response = await axiosConfig.delete(`/marcas/`, {data: { ids }});
        return response.data;

}
