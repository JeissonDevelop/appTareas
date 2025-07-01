// types/next-auth.d.ts

import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      nombre: string;
      correo: string;
      rol: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      nombre: string;
      correo: string;
      rol: string;
    };
  }
}
