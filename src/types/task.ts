export interface Tarea {
  _id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  Usuario_id?: {
    _id: string;
    nombre: string;
  } | string;
}
