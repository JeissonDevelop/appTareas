'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Usuarios } from '@/types/user';

interface Tarea {
  _id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  Usuario_id: Usuarios;
}

export default function EditarTarea() {
  const router = useRouter();
  const { id } = useParams();

  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [completada, setCompletada] = useState(false);
  const [usuarioId, setUsuarioId] = useState("");
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);

  // ✅ Obtener datos de la tarea
  useEffect(() => {
    async function fetchTarea() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        const data: Tarea = await res.json();
        setTarea(data);
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setCompletada(data.completada);
        setUsuarioId(data.Usuario_id?._id || "");
      } catch (error) {
        console.error("Error cargando tarea:", error);
      }
    }

    fetchTarea();
  }, [id]);

  // ✅ Obtener usuarios válidos (que no sean User)
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setUsuarios([]);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setUsuarios([]);
      }
    }

    fetchUsuarios();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, completada, Usuario_id: usuarioId }),
    });

    if (res.ok) {
      router.push("/tasks");
    } else {
      const error = await res.json();
      alert(`Error al actualizar la tarea: ${error.message || "Error desconocido"}`);
    }
  };

  const handleCancelar = () => {
    router.push("/tasks");
  };

  if (!tarea) return <p className="p-4">Cargando tarea...</p>;

  return (
    <form onSubmit={handleUpdate} className="flex flex-col justify-center h-screen gap-4 max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">Editar Tarea</h1>

      <div>
        <label className="block mb-1 font-medium">Título:</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Usuario asignado:</label>
        <select
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="" className="text-gray-500">-- Selecciona un usuario --</option>
          {usuarios.map((usuario) => (
            <option key={usuario._id} value={usuario._id} className="text-black">
              {usuario.nombre}
            </option>
          ))}
        </select>
        {usuarios.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            No hay usuarios con permisos disponibles
          </p>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completada}
          onChange={(e) => setCompletada(e.target.checked)}
        />
        <span>¿completada?</span>
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="submit" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded">
          Actualizar
        </button>
        <button
          type="button"
          onClick={handleCancelar}
          className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
