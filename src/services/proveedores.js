import axiosConfig from '../lib/axios';
export const obtenerProveedores = async () => {

        const response = await axiosConfig.get('/proveedores/');
        return response.data;

}
export const crearProveedor = async (proveedor) => {

        const response = await axiosConfig.post('/proveedores/', proveedor);
        return response.data;

}

export const editarProveedor = async (id, proveedor) => {

        console.log("Editar proveedor", id, proveedor);
        const response = await axiosConfig.put(`/proveedores/${id}`, proveedor);
        return response.data;

}
export const eliminarProveedor = async (ids) => {

        console.log("Editar proveedor", ids);
        const response = await axiosConfig.delete(`/proveedores/`, {data: { ids }});
        return response.data;

}
