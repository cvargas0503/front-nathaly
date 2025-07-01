import axiosConfig from '../lib/axios';
export const asignarPermisosUsuario = async (data) => {
    try {
        const response = await axiosConfig.post('/permisos/asignar-permisos', data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const removerPermisosUsuario = async (data) => {
    try {
        const response = await axiosConfig.post('/permisos/revocar-permisos', data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerPermisos = async (idEmpleado) => {
    try {
        const response = await axiosConfig.get('/permisos/empleado/'+idEmpleado);
        return response.data;
    } catch (error) {
        throw error;
    }    
}