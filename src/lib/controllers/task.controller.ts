// controllers/tareas.controller.ts
import Tarea from "@/models/task";
import "@/models/user";

// Todas las tareas (sin filtro por usuario)
export async function obtenerTodasLasTareas() {
  return await Tarea.find().populate("Usuario_id", "nombre"); // ← ahora sí funciona
  
}

// Obtener una sola tarea por ID con usuario asociado
export async function obtenerTareaPorId(id: string) {
  try {
    const tarea = await Tarea.findById(id).populate("Usuario_id", "nombre");
    return tarea;
  } catch (error) {
    console.error("Error al obtener tarea por ID:", error);
    return null;
  }
}

// Crear tarea sin usuario
export async function crearTarea(data: { titulo: string; descripcion?: string; Usuario_id?: string }) {
  const nueva = new Tarea({
    titulo: data.titulo,
    descripcion: data.descripcion,
    Usuario_id: data.Usuario_id ?? null, // 👈 aquí se toma desde data
    completada: false,
  });

  await nueva.save();
  return nueva;
}


export async function actualizarTarea(
  id: string,
  datos: Partial<{ titulo: string; descripcion: string; completada: boolean; Usuario_id: string }>
) {
  return await Tarea.findByIdAndUpdate(id, datos, { new: true });

}


export async function eliminarTarea(id: string) {
  return await Tarea.findByIdAndDelete(id);
}
