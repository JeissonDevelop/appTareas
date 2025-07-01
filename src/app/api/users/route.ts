// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { createUser, getUsers } from "@/lib/controllers/user.controller";
import { userSchema } from "@/lib/validations/user.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

//listar todos los usuarios
export async function GET() {
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({error: "Usuario no Autenticado"}, {status: 401})
    }
    const rol = session.user.rol
    if(rol !== "Admin" && rol !== "SuperAdmin"){
    }

    await connectToDatabase()

    const users = await getUsers()

    return NextResponse.json(users)
    
}

//crear un usuario
export async function POST(req:Request) {

    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({error: "Usuario no Autenticado"}, {status: 401})
    }
    const rol = session.user.rol
    if(rol !== "SuperAdmin"){
        return NextResponse.json({error: "No Autorizado"}, {status: 403})
    }

    try{
        await connectToDatabase()
        const data = await req.json()

        const parsed = userSchema.safeParse(data)
        if(!parsed.success){
            return NextResponse.json(
                {error: "Datos invalidos", detalles: parsed.error.format()},
                {status: 400}
            )
        }

        const newUser = await createUser(parsed.data)

        return NextResponse.json(newUser, {status: 201})
    }catch(error:unknown){
        if (error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 400})
        }
        return NextResponse.json({error: 'Error inesperado del servidor'}, {status: 500})
    }
    
}