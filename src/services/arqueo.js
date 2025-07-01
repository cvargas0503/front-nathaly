import axiosConfig from '../lib/axios';
export const obtenerDatosArqueoIni = async () => {
    try {
        const response = await axiosConfig.get(`/arqueos/datos-apertura-arqueo`);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const cargarArqueoAPI = async (fecha, idEmpleado, idSucursal) => {
    try {
        const response = await axiosConfig.get(`/arqueos`, {
            params: {
                fecha,
                idEmpleado,
                idSucursal
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const guardarArqueoAPI = async (data) => {
    try {
        const response = await axiosConfig.post(`/arqueos/arqueo`, data);
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const obtenerPDFArqueo = async (id) => {
    try {
        const response = await axiosConfig.get(`/arqueos/arqueo/reporte/${id}`, { responseType: "blob" });
        return response.data;
    } catch (error) {
        throw error;
    }    
}