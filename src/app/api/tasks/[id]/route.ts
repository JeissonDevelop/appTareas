import { connectToDatabase } from "@/lib/mongoose";
import {
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
} from "@/lib/controllers/task.controller";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectToDatabase();

  const tarea = await obtenerTareaPorId(id);
  if (!tarea) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }

  return NextResponse.json(tarea);
}

// PUT /api/tasks/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  await connectToDatabase();

  const actualizada = await actualizarTarea(id, body);
  return NextResponse.json(actualizada);
}

// DELETE /api/tasks/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectToDatabase();

  const eliminada = await eliminarTarea(id);
  return NextResponse.json(eliminada);
}
