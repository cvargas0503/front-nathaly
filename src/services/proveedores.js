import axiosConfig from '../lib/axios';
export const obtenerProveedores = async () => {
    try {
        const response = await axiosConfig.get('/proveedores/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearProveedor = async (proveedor) => {
    try {
        const response = await axiosConfig.post('/proveedores/', proveedor);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarProveedor = async (id, proveedor) => {
    try {
        console.log("Editar proveedor", id, proveedor);
        const response = await axiosConfig.put(`/proveedores/${id}`, proveedor);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarProveedor = async (ids) => {
    try {
        console.log("Editar proveedor", ids);
        const response = await axiosConfig.delete(`/proveedores/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}