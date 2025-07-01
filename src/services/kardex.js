import axiosConfig from '../lib/axios';
export const obtenerKardexGeneral = async () => {
    try {
        const response = await axiosConfig.get('/kardex/kardex-general');
        return response.data;
    } catch (error) {
        throw error;
    }    
}

export const obtenerMovimientosPorProducto = async (id, idBodega) => {
    try {
        console.log("Fetching movimientos for product:", id, "in bodega:", idBodega);
        const response = await axiosConfig.get('/kardex/movimientos-producto', 
            {
                params: {
                    idProducto: id, idBodega: idBodega
                }
               
            });
        return response.data;
    } catch (error) {
        throw error;
    }    
}