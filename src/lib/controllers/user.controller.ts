import Usuario from "@/models/user";
import { Usuarios } from "@/types/user";
import bcrypt from "bcryptjs";

//traer todos los usuarios - la contraseña
export const getUsers = async () =>{
    return await Usuario.find().select("-contrasena")
}

//traer un usuario por ID
export const getUsersById = async (id: string) =>{
    return await Usuario.findById(id).select("-contrasena")
}

//crear un usuario
export const createUser = async (datos: {nombre: string; correo: string; contrasena: string; rol: string}) =>{
    const {nombre,correo,contrasena,rol}=datos

    const existe = await Usuario.findOne({correo})
    if(existe){
        throw new Error("El correo ya esta en uso")
    }

    const hashed = await bcrypt.hash(contrasena,10)

    return await Usuario.create({nombre,correo,contrasena:hashed,rol})
}

//actualizar un usuario
export const updateUser = async (
  id: string,
  datos: Partial<Omit<Usuarios, "_id">> // Todos los campos excepto _id, y todos opcionales
) => {
  if (datos.contrasena) {
    datos.contrasena = await bcrypt.hash(datos.contrasena, 10);
  }

  return await Usuario.findByIdAndUpdate(id, datos, {
    new: true,
  }).select("-contrasena");
};

//eliminar un usuario por ID
export const deleteUser = async(id: string) =>{
    return await Usuario.findByIdAndDelete(id)
}

export async function verificarCredenciales(correo: string, contrasena: string) {

  const usuario = await Usuario.findOne({ correo });
  if (!usuario) return null;

  const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordValida) return null;

  // No devuelvas la contraseña
  return usuario.toObject();
}
