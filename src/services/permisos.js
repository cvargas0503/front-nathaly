import axiosConfig from '../lib/axios';
export const asignarPermisosUsuario = async (data) => {

        const response = await axiosConfig.post('/permisos/asignar-permisos', data);
        return response.data;

}
export const removerPermisosUsuario = async (data) => {

        const response = await axiosConfig.post('/permisos/revocar-permisos', data);
        return response.data;

}
export const obtenerPermisos = async (idEmpleado) => {

        const response = await axiosConfig.get('/permisos/empleado/'+idEmpleado);
        return response.data;

}
