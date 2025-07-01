// app/api/users/register/route.ts
import { connectToDatabase } from '@/lib/mongoose';
import Usuario from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { userSchema } from '@/lib/validations/user.schema';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();

  // ✅ Validar con Zod
  const result = userSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({
      error: 'Datos inválidos',
      detalles: result.error.flatten(),
    }, { status: 400 });
  }

  const { nombre, correo, contrasena } = result.data;

  const userExist = await Usuario.findOne({ correo });
  if (userExist) return NextResponse.json({ message: 'Ya registrado' }, { status: 400 });

  const hashed = await bcrypt.hash(contrasena, 10);
  const user = await Usuario.create({ nombre, correo, contrasena: hashed });

  return NextResponse.json(user, { status: 201 });
}
