import axiosConfig from '../lib/axios';
export const crearUsuario = async (data) => {
    try {
        const response = await axiosConfig.post('/usuarios/', data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ObtenerUsuarios = async () => {
    try {
        const response = await axiosConfig.get('/usuarios/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const ObtenerEmpleadosSinUsuario = async () => {
    try {
        const response = await axiosConfig.get('/usuarios/empleados-sin-usuario');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const modificarPassword = async (nuevaPassword, id) => {
    try {
        const response = await axiosConfig.put('/usuarios/' + id, {password: nuevaPassword});
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const deshabilitarUsuario = async (id) => {
    try {
        const response = await axiosConfig.delete('/usuarios/' + id);
        return response.data;
    } catch (error) {
        throw error;
    }    
}