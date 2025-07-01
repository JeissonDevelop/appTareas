import { NextRequest, NextResponse } from "next/server";
import { verificarCredenciales } from "@/lib/controllers/user.controller";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
    await connectToDatabase();
  const { correo, contrasena } = await req.json();

  // Validar campos
  if (!correo || !contrasena) {
    return NextResponse.json({ error: "Correo y contraseña son obligatorios" }, { status: 400 });
  }

  // Verificar credenciales
  const usuario = await verificarCredenciales(correo, contrasena);
  if (!usuario) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // Puedes retornar el usuario sin contraseña o un token si usarás JWT
  return NextResponse.json({
    mensaje: "Login exitoso",
    usuario,
  });
}
