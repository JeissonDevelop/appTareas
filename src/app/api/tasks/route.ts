import { connectToDatabase } from "@/lib/mongoose";
import {
  obtenerTodasLasTareas,
  crearTarea,
} from "@/lib/controllers/task.controller";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const tareas = await obtenerTodasLasTareas(); // 👈 Nueva función que no depende de sesión
  return NextResponse.json(tareas);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const data = await req.json();

  const tarea = await crearTarea(data); // 👈 Si quieres que se permita crear sin usuario
  return NextResponse.json(tarea);
}
