import axiosConfig from '../lib/axios';
export const obtenerProductos = async () => {
    try {
        const response = await axiosConfig.get('/productos/');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const crearProducto = async (form) => {
    try {
        console.log("HJppa")
        console.log("ajajja")
        const formData = new FormData();

        formData.append("codigo", form.codigo);
        formData.append("descripcion", form.descripcion);
        formData.append("costo", form.costo.toString());
        formData.append("existenciaMin", form.existenciaMin.toString());
        formData.append("existenciaMax", form.existenciaMax.toString());
        formData.append("idMarca", form.idMarca.toString());
        formData.append("idCategoria", form.idCategoria.toString());
        formData.append("idProveedor", form.idProveedor.toString());
        formData.append("idLinea", form.idLinea.toString());
        formData.append("referencia", form.referencia);

        // Agregar precios como JSON string
        formData.append("precios", JSON.stringify(form.precios));

        formData.append("imagen", form.imagen); // solo una imagen
        const response = await axiosConfig.post('/productos/', formData);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const editarProducto = async (id, producto) => {
    try {
        console.log("Editar producto", id, producto);
        const response = await axiosConfig.put(`/productos/${id}`, producto);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const eliminarProducto = async (ids) => {
    try {
        console.log("Editar producto", ids);
        const response = await axiosConfig.delete(`/productos/`, {data: { ids }});
        return response.data;
    } catch (error) {
        throw error;
    }    
}