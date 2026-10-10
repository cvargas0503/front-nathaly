import axiosConfig from '../lib/axios';
export const obtenerClientes = async () => {

        const response = await axiosConfig.get('/clientes/');
        return response.data;

}
export const crearCliente = async (cliente) => {

        const response = await axiosConfig.post('/clientes/', cliente);
        return response.data;

}

export const editarCliente = async (id, cliente) => {

        console.log("Editar cliente", id, cliente);
        const response = await axiosConfig.put(`/clientes/${id}`, cliente);
        return response.data;

}
export const eliminarCliente = async (ids) => {

        console.log("Editar cliente", ids);
        const response = await axiosConfig.delete(`/clientes/`, {data: { ids }});
        return response.data;

}
