import axiosConfig from '../lib/axios';
export const obtenerDatosArqueoIni = async () => {

        const response = await axiosConfig.get(`/arqueos/datos-apertura-arqueo`);
        return response.data;

}
export const cargarArqueoAPI = async (fecha, idEmpleado, idSucursal) => {

        const response = await axiosConfig.get(`/arqueos`, {
            params: {
                fecha,
                idEmpleado,
                idSucursal
            }
        });
        return response.data;

}

export const guardarArqueoAPI = async (data) => {

        const response = await axiosConfig.post(`/arqueos/arqueo`, data);
        return response.data;

}

export const obtenerPDFArqueo = async (id) => {

        const response = await axiosConfig.get(`/arqueos/arqueo/reporte/${id}`, { responseType: "blob" });
        return response.data;

}

export const cerrarArqueoAPI = async (id) => {

        const response = await axiosConfig.patch(`/arqueos/${id}/cerrar`);
        return response.data;

}
