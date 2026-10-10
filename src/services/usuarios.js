import axiosConfig from '../lib/axios';
export const crearUsuario = async (data) => {

        const response = await axiosConfig.post('/usuarios/', data);
        return response.data;

}
export const ObtenerUsuarios = async () => {

        const response = await axiosConfig.get('/usuarios/');
        return response.data;

}
export const ObtenerEmpleadosSinUsuario = async () => {

        const response = await axiosConfig.get('/usuarios/empleados-sin-usuario');
        return response.data;

}

export const ObtenerEmpleadosConUsuario = async () => {

        const response = await axiosConfig.get('/usuarios/empleados-con-usuario');
        return response.data;

}

export const modificarPassword = async (nuevaPassword, id) => {

        const response = await axiosConfig.put('/usuarios/' + id, {password: nuevaPassword});
        return response.data;

}
export const deshabilitarUsuario = async (id) => {

        const response = await axiosConfig.delete('/usuarios/' + id);
        return response.data;

}
