import axiosConfig from '../lib/axios';
export const obtenerDatosFormularioProducto = async () => {
    try {
        const response = await axiosConfig.get('/datos/datos-formulario-producto');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerDatosFormularioCompra = async () => {
    try {
        const response = await axiosConfig.get('/datos/datos-formulario-compra');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerDatosFormularioCliente = async () => {
    try {
        const response = await axiosConfig.get('/datos/datos-formulario-cliente');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerDatosFormularioFactura = async () => {
    try {
        const response = await axiosConfig.get('/datos/datos-formulario-factura');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerDatosProductosFacturacion = async (idSucursal) => {
    try {
        const response = await axiosConfig.get(`/datos/datos-productos-factura/${idSucursal}`);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const obtenerDatosFormularioTraslado = async () => {
    try {
        const response = await axiosConfig.get('/datos/datos-formulario-traslado');
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const obtenerStockBodega = async (idBodega) => {
    try {
        const response = await axiosConfig.get(`/datos/datos-stock-bodega/${idBodega}`);
        return response.data;
    } catch (error) {
        throw error;
    }    
}