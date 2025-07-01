import axiosConfig from '../lib/axios';
export const obtenerClientes = async () => {
    try {
        const response = await axiosConfig.get('/clientes/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearCliente = async (cliente) => {
    try {
        const response = await axiosConfig.post('/clientes/', cliente);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarCliente = async (id, cliente) => {
    try {
        console.log("Editar cliente", id, cliente);
        const response = await axiosConfig.put(`/clientes/${id}`, cliente);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarCliente = async (ids) => {
    try {
        console.log("Editar cliente", ids);
        const response = await axiosConfig.delete(`/clientes/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}