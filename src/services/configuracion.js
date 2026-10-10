import axiosConfig from '../lib/axios';

export const obtenerTasaCambio = async () => {

    const response = await axiosConfig.get('/configuracion/tasa-cambio');
    return response.data;

};

export const actualizarTasaCambio = async (valor) => {

    const response = await axiosConfig.put('/configuracion/tasa-cambio', { valor });
    return response.data;

};
