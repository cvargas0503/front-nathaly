import axiosConfig from '../lib/axios';
export const crearSucursales = async (form) => {

        console.log("Crear sucursal", form);
        const dataToSend = new FormData();
        dataToSend.append("imagen", form.imagen); // Debe coincidir con upload.single("imagen")
        dataToSend.append("codigoSucursal", form.codigoSucursal);
        dataToSend.append("nombre", form.nombre);
        dataToSend.append("direccion", form.direccion);
        dataToSend.append("idCiudad", form.idCiudad);

        form.telefonos.forEach(tel => {
        dataToSend.append("telefonos[]", tel);
        });
        console.log("Crear sucursal", dataToSend);
        const response = await axiosConfig.post('/sucursales/', dataToSend);
        return response.data;

}
export const actualizarSucursal = async (form) => {

        console.log("actualizar sucursal", form);
        const dataToSend = new FormData();
        if(form.imagen) {
            // Solo agregar imagen si existe
        dataToSend.append("imagen", form.imagen); // Debe coincidir con upload.single("imagen")
        }
        dataToSend.append("codigoSucursal", form.codigoSucursal);
        dataToSend.append("nombre", form.nombre);
        dataToSend.append("direccion", form.direccion);
        dataToSend.append("idCiudad", form.idCiudad);

        form.telefonos.forEach(tel => {
        dataToSend.append("telefonos[]", tel);
        });
        console.log("Crear sucursal", dataToSend);
        const response = await axiosConfig.put(`/sucursales/${form.idSucursal}`, dataToSend);
        return response.data;

}
export const EliminarSucursal = async (idSucursal) => {

        const response = await axiosConfig.delete(`/sucursales/${idSucursal}`);
        return response.data;

}
