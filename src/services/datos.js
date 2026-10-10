import axiosConfig from '../lib/axios';
export const obtenerDatosFormularioProducto = async () => {

        const response = await axiosConfig.get('/datos/datos-formulario-producto');
        return response.data;

}
export const obtenerDatosFormularioCompra = async () => {

        const response = await axiosConfig.get('/datos/datos-formulario-compra');
        return response.data;

}
export const obtenerDatosFormularioCliente = async () => {

        const response = await axiosConfig.get('/datos/datos-formulario-cliente');
        return response.data;

}
export const obtenerDatosFormularioFactura = async () => {

        const response = await axiosConfig.get('/datos/datos-formulario-factura');
        return response.data;

}
export const obtenerDatosProductosFacturacion = async (idSucursal) => {

        const response = await axiosConfig.get(`/datos/datos-productos-factura/${idSucursal}`);
        return response.data;

}

export const obtenerDatosFormularioTraslado = async () => {

        const response = await axiosConfig.get('/datos/datos-formulario-traslado');
        return response.data;

}
export const obtenerStockBodega = async (idBodega) => {

        const response = await axiosConfig.get(`/datos/datos-stock-bodega/${idBodega}`);
        return response.data;

}
