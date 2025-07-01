'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import LogoutButton from '../components/LogoutButton';
import { Tarea } from '@/types/task';

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
  async function fetchTareas() {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' });
      const data = await res.json();

      if (!Array.isArray(data)) {
        setTareas([]);
        return;
      }

      const rol = session?.user?.rol;
      const userId = session?.user?.id;

      if (rol === "User" && userId) {
        // Filtrar solo las tareas asignadas a este usuario
        const filtradas = data.filter((t: Tarea) => {
          return (
            typeof t.Usuario_id === "object" &&
            t.Usuario_id !== null &&
            t.Usuario_id._id === userId
          );
        });
        setTareas(filtradas);
      } else {
        // Si es Admin o SuperAdmin, mostrar todas
        setTareas(data);
      }

    } catch (error) {
      console.error("Error al cargar tareas:", error);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  }

  if (status === "authenticated") {
    fetchTareas();
  }
}, [session, status]);


  const handleDelete = async (id: string) => {
    if (status === 'loading') return;

    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTareas((prev) => prev.filter((t) => t._id !== id));
      } else {
        const error = await res.json();
        alert(`Error al eliminar: ${error.message}`);
      }
    } catch (error) {
      alert('Error de red al intentar eliminar la tarea.');
      console.error('Error al eliminar tarea:', error);
    }
  };

  const handleUsuariosClick = () => {
    if (status === 'loading') return;
    const rol = session?.user?.rol;
    if (!session || rol === 'User') {
      alert('No tienes permisos para acceder a la sección de usuarios.');
      return;
    }
    router.push('/users');
  };

  const handleToggleCompletada = async (id: string, actual: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada: !actual }),
      });

      if (res.ok) {
        const actualizada = await res.json();
        setTareas((prev) =>
          prev.map((t) => (t._id === id ? { ...t, completada: actualizada.completada } : t))
        );
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error('Error al marcar tarea:', err);
      alert('No se pudo actualizar la tarea');
    }
  };

  if (loading) return <p className="p-8">Cargando tareas...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
          Home
        </Link>
        <h1 className="text-2xl font-bold">Listado de Tareas</h1>
        <div className="flex space-x-4">
          <Link
            href="/tasks/nueva"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Crear Tarea
          </Link>
          <button
            onClick={handleUsuariosClick}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Usuarios
          </button>
          <LogoutButton />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-black border border-gray-300 rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Título</th>
              <th className="py-2 px-4 border-b text-left">Descripción</th>
              <th className="py-2 px-4 border-b text-left">Usuario Responsable</th>
              <th className="py-2 px-4 border-b text-left">Estado</th>
              <th className="py-2 px-4 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50 hover:text-black">
                <td className="px-6 py-4 border-b text-left">{t.titulo}</td>
                <td className="px-6 py-4 border-b text-left">{t.descripcion || '—'}</td>
                <td className="px-6 py-4 border-b text-left">
                  {typeof t.Usuario_id === 'object' && t.Usuario_id !== null && 'nombre' in t.Usuario_id
                    ? t.Usuario_id.nombre
                    : 'Sin asignar'}
                </td>
                <td className="px-6 py-4 border-b text-left">
                  <button
                    onClick={() => handleToggleCompletada(t._id, t.completada)}
                    className={`text-sm rounded px-2 py-1 ${
                      t.completada ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
                    }`}
                  >
                    {t.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
                  </button>
                </td>
                <td className="px-6 py-4 border-b text-center">
                  <Link href={`/tasks/${t._id}`} className="text-blue-600 hover:underline mr-4">
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500 hover:underline mr-4"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
