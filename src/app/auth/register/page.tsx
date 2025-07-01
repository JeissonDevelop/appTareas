'use client';
import PasswordInput from '@/app/components/PasswordInput';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { userSchema } from '@/lib/validations/user.schema';

export default function CrearUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar antes de enviar
    const result = userSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        nombre: fieldErrors.nombre?.[0] || '',
        correo: fieldErrors.correo?.[0] || '',
        contrasena: fieldErrors.contrasena?.[0] || '',
      });
      return; // 👈 Detiene el envío si hay errores
    }

    setErrors({}); // Limpia errores anteriores

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/auth/login');
    } else {
      const data = await res.json();
      alert(data.message || 'Error al crear el usuario');
    }
  };

  const handleCancelar = () => {
    router.push('/auth/login');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black-100">
      <h1 className="text-2xl font-bold text-center mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
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

        <div>
          <PasswordInput
            name="contrasena"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena}</p>}
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-8 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
