import axiosConfig from '../lib/axios';
export const obtenerEmpleados = async () => {
    try {
        const response = await axiosConfig.get('/empleados/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearEmpleado = async (empleado) => {
    try {
        const response = await axiosConfig.post('/empleados/', empleado);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const editarEmpleado = async (id, empleado) => {
    try {
        console.log("Editar empleado", id, empleado);
        const response = await axiosConfig.put(`/empleados/${id}`, empleado);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarEmpleado = async (ids) => {
    try {
        console.log("Editar empleado", ids);
        const response = await axiosConfig.delete(`/empleados/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}