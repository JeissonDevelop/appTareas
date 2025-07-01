// app/api/usuarios/[id]/route.ts
import { connectToDatabase } from "@/lib/mongoose";
import {
  getUsersById,
  updateUser,
  deleteUser,
} from "@/lib/controllers/user.controller";
import { NextResponse } from "next/server";
import { updateUserSchema } from "@/lib/validations/user.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

//listar un usuario por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Usuario no Autenticado" },
      { status: 401 }
    );
  }
  const rol = session.user.rol;
  if (rol !== "SuperAdmin") {
    return NextResponse.json({ error: "No Autorizado" }, { status: 403 });
  }
  await connectToDatabase();
  const usuario = await getUsersById(params.id);
  return NextResponse.json(usuario);
}

//actualizar un usuario por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Usuario no Autenticado" },
      { status: 401 }
    );
  }
  const rol = session.user.rol;
  if (rol !== "SuperAdmin") {
    return NextResponse.json({ error: "No Autorizado" }, { status: 403 });
  }
  try {
    await connectToDatabase();
    const data = await req.json();

    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // ✅ parsed.data es seguro de usar aquí
    const usuarioActualizado = await updateUser(params.id, parsed.data);
    return NextResponse.json(usuarioActualizado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error inesperado del servidor" },
      { status: 500 }
    );
  }
}

//eliminar un usuario por ID
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Usuario no Autenticado" },
      { status: 401 }
    );
  }
  const rol = session.user.rol;
  if (rol !== "SuperAdmin") {
    return NextResponse.json({ error: "No Autorizado" }, { status: 403 });
  }
  await connectToDatabase();
  await deleteUser(params.id);
  return NextResponse.json({ mensaje: "Usuario eliminado" });
}
