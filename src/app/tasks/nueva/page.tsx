'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Usuarios } from '@/types/user'

export default function FormularioNuevaTarea() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [usuarios, setUsuarios] = useState<Usuarios[]>([])
  const [usuarioId, setUsuarioId] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()

        if (!res.ok || !Array.isArray(data)) {
          console.warn('Respuesta inesperada al obtener usuarios:', data)
          setUsuarios([])
          return
        }

        setUsuarios(data)
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        setUsuarios([])
      }
    }

    fetchUsuarios()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!usuarioId) {
      alert('Debes seleccionar un usuario')
      return
    }

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        descripcion,
        Usuario_id: usuarioId,
      }),
    })

    if (res.ok) {
      setTitulo('')
      setDescripcion('')
      setUsuarioId('')
      router.push('/tasks')
    } else {
      console.error('Error al crear la tarea')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center h-screen gap-4 max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold text-center mb-4">Crear Nueva Tarea</h1>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="border p-2 rounded"
      />

      <select
        value={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}
        className="border p-2 rounded"
        required
      >
        <option value="" className="text-gray-500">-- Selecciona un usuario --</option>
        {Array.isArray(usuarios) && usuarios.map((usuario) => (
          <option key={usuario._id} value={usuario._id} className="text-black">
            {usuario.nombre}
          </option>
        ))}
      </select>

      <div className="flex gap-2 justify-between">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Crear tarea
        </button>
        <button
          type="button"
          onClick={() => router.push('/tasks')}
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
