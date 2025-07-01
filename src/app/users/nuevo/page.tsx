'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import PasswordInput from '@/app/components/PasswordInput';
import { userSchema } from '@/lib/validations/user.schema';

export default function CrearUsuarioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar sesión y rol de usuario
  useEffect(() => {
    if (status === 'loading') return;

    const rol = session?.user?.rol;
    if (!session || rol !== 'SuperAdmin') {
      alert('Acceso denegado. Solo el Super Administrador pueden crear usuarios.');
      router.push('/users');
    }
  }, [session, status, router]);

  // Manejador de cambios en inputs y select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = userSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        nombre: fieldErrors.nombre?.[0] || '',
        correo: fieldErrors.correo?.[0] || '',
        contrasena: fieldErrors.contrasena?.[0] || '',
        rol: fieldErrors.rol?.[0] || '',
      });
      return;
    }

    setErrors({}); // limpiar errores anteriores

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/users');
    } else {
      const error = await res.json();
      alert(error.message || 'Error al crear el usuario');
    }
  };

  const handleCancelar = () => {
    router.push('/users');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center h-screen gap-4 max-w-md mx-auto mt-8"
    >
      <h1 className="text-xl font-bold text-center mb-4">Crear Usuario</h1>

      {/* Nombre */}
      <div>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border p-2"
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
      </div>

      {/* Correo */}
      <div>
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          className="w-full border p-2"
        />
        {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
      </div>

      {/* Contraseña */}
      <div>
        <PasswordInput
          name="contrasena"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={handleChange}
        />
        {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena}</p>}
      </div>

      {/* Rol */}
      <div>
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="" disabled className="text-gray-500">-- Selecciona un rol --</option>
          <option value="User" className="text-black">User</option>
          <option value="Admin" className="text-black">Admin</option>
          <option value="SuperAdmin" className="text-black">SuperAdmin</option>
        </select>
        {errors.rol && <p className="text-red-500 text-sm">{errors.rol}</p>}
      </div>

      {/* Botones */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-8 py-2 rounded hover:bg-blue-700"
        >
          Crear
        </button>
        <button
          type="button"
          onClick={handleCancelar}
          className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
