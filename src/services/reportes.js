import axiosConfig from '../lib/axios';

export const obtenerReporteVentas = async (desde, hasta, idSucursal) => {

    const params = { desde, hasta };
    if (idSucursal) params.idSucursal = idSucursal;
    const response = await axiosConfig.get('/reportes/ventas', { params });
    return response.data;

};

export const exportarReporteVentas = async (desde, hasta, formato = 'pdf') => {

    const response = await axiosConfig.get('/reportes/ventas/exportar', {
      params: { desde, hasta, formato },
      responseType: 'blob',
    });
    return response.data;

};

export const obtenerReporteCompras = async (desde, hasta) => {

    const response = await axiosConfig.get('/reportes/compras', { params: { desde, hasta } });
    return response.data;

};

export const obtenerInventarioValorizado = async () => {

    const response = await axiosConfig.get('/reportes/inventario/valorizado');
    return response.data;

};

export const obtenerCierreDiario = async (fecha, idSucursal) => {

    const params = { fecha };
    if (idSucursal) params.idSucursal = idSucursal;
    const response = await axiosConfig.get('/reportes/caja/cierre-diario', { params });
    return response.data;

};
