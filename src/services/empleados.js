import axiosConfig from '../lib/axios';
export const obtenerEmpleados = async () => {

        const response = await axiosConfig.get('/empleados/');
        return response.data;

}
export const crearEmpleado = async (empleado) => {

        const response = await axiosConfig.post('/empleados/', empleado);
        return response.data;

}
export const editarEmpleado = async (id, empleado) => {

        console.log("Editar empleado", id, empleado);
        const response = await axiosConfig.put(`/empleados/${id}`, empleado);
        return response.data;

}
export const eliminarEmpleado = async (ids) => {

        console.log("Editar empleado", ids);
        const response = await axiosConfig.delete(`/empleados/`, {data: { ids }});
        return response.data;

}
