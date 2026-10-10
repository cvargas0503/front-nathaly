import axiosConfig from '../lib/axios';
export const obtenerLineas = async () => {

        const response = await axiosConfig.get('/lineas/');
        return response.data;

}
export const crearLinea = async (linea) => {

        const response = await axiosConfig.post('/lineas/', linea);
        return response.data;

}

export const editarLinea = async (id, linea) => {

        console.log("Editar linea", id, linea);
        const response = await axiosConfig.put(`/lineas/${id}`, linea);
        return response.data;

}
export const eliminarLinea = async (ids) => {

        console.log("Editar linea", ids);
        const response = await axiosConfig.delete(`/lineas/`, {data: { ids }});
        return response.data;

}
