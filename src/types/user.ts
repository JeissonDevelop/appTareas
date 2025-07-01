export interface Usuarios {
  _id: string;      // <- no como ObjectId
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
}
