import { z } from 'zod'

export const userSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener almenos 2 caracteres"),
    correo: z.string().email("Correo electronico invalido"),
    contrasena: z.string().min(6,"La contraseña debe tener al menos 6 caracteres"),
    rol: z.string().default("User")
});

//para actuliza todos los campos opcionale
export const updateUserSchema = userSchema.partial();