import axiosConfig from '../lib/axios';
export interface SolicitudVenta {
  idCliente: number; idEmpleado: number; idSucursal: number; idTermino: number; fecha: string;
  detalles: Array<{idProducto: number; cantidad: number; precioUnitario: number; descuento: number}>;
}
export interface Factura { idVenta: number | string; [campo: string]: unknown }
export interface RespuestaVenta { success: boolean; message: string; data: Factura; reutilizada: boolean }
export const NuevaVenta = async (form: SolicitudVenta, clave: string): Promise<RespuestaVenta> => {
  const response = await axiosConfig.post<RespuestaVenta>('/ventas/', form, { headers: { 'Idempotency-Key': clave } });
  return response.data;
};
export const ObtenerVentas = async () => (await axiosConfig.get('/ventas/')).data;
export const ObtenerVentasPendientes = async () => (await axiosConfig.get('/ventas/ventas-pendientes')).data;
export const EliminarVenta = async (id: number | string) => (await axiosConfig.delete('/ventas/' + id)).data;
