// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import Usuario from "@/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: {},
        contrasena: {},
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await Usuario.findOne({ correo: credentials?.correo });

        if (!user) throw new Error("Usuario no encontrado");

        const match = await bcrypt.compare(
          credentials!.contrasena,
          user.contrasena
        );
        if (!match) throw new Error("Contraseña incorrecta");

        return { id: user._id, nombre: user.nombre, correo: user.correo, rol: user.rol };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user && session.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login"
  }
};
