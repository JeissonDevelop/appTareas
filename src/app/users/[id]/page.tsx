'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { updateUserSchema } from '@/lib/validations/user.schema';

export default function EditarUsuarioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Verificación de rol y sesión
  useEffect(() => {
    if (status === 'loading') return;

    const rol = session?.user?.rol;
    if (!session || rol !== 'SuperAdmin') {
      alert('Acceso denegado. Solo el Super Administrador pueden editar usuarios.');
      router.push('/users');
    }
  }, [session, status, router]);

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      setForm({
        nombre: data.nombre,
        correo: data.correo,
        contrasena: '',
        rol: data.rol,
      });
    };
    fetchUsuario();
  }, [id]);

  // Enviar actualización
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value !== '')
    );

    const result = updateUserSchema.safeParse(cleanedForm);
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

    setErrors({});

    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedForm),
    });

    if (res.ok) {
      router.push('/users');
    } else {
      const error = await res.json();
      alert(error.message || 'Error al actualizar usuario');
    }
  };

  const handleCancelar = () => {
    router.push('/users');
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col justify-center h-screen gap-4 max-w-md mx-auto mt-8"
    >
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>

      <div>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border p-2"
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
      </div>

      <div>
        <input
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="w-full border p-2"
        />
        {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Nueva contraseña (opcional)"
          value={form.contrasena}
          onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
          className="w-full border p-2"
        />
        {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena}</p>}
      </div>

      <div>
        <select
          name="rol"
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
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

      <div className="flex justify-center mt-4 space-x-4">
        <button className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700">
          Actualizar
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
