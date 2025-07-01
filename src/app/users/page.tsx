'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Usuarios } from '@/types/user';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

export default function UsuariosPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuarios[]>([]);

    useEffect(() => {
        if (status === "loading") return;

        const rol = session?.user?.rol;
        if (!session || (rol !== "Admin" && rol !== "SuperAdmin")) {
            alert('Acceso denegado. Solo Administradores pueden ver esta página.');
            router.push('/dashboard');
        }
    }, [session, status, router]);

    // Obtener usuarios desde la API
    const fetchUsuarios = async () => {
        const res = await fetch('/api/users');
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Respuesta no válida:", data);
            alert(data.error || "Error al obtener usuarios");
            return;
        }

        setUsuarios(data);
    };

    // Eliminar usuario por ID
    const eliminarUsuario = async (id: string) => {
        const rol = session?.user?.rol;

        if (rol !== 'SuperAdmin') {
            alert('Acceso denegado. Solo SuperAdmins pueden eliminar usuarios.');
            return;
        }

        const confirmar = confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmar) return;

        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });

            if (res.ok) {
                alert('Usuario eliminado correctamente.');
                fetchUsuarios();
            } else {
                const error = await res.json();
                alert(error.message || 'Error al eliminar usuario');
            }
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            alert('Ocurrió un error inesperado');
        }
    };

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    if (status === "loading") return <p className="p-4">Cargando...</p>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <Link href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Home</Link>
                <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
                <div className="flex space-x-4">
                    <Link href="/users/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Crear Usuario</Link>
                    <Link href="/tasks" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Tareas</Link>
                    <LogoutButton />
                </div>
            </div>

            <table className="min-w-full bg-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b text-left">ID</th>
                        <th className="px-6 py-3 border-b text-left">Nombre</th>
                        <th className="px-6 py-3 border-b text-left">Correo</th>
                        <th className="px-6 py-3 border-b text-left">Rol</th>
                        <th className="px-6 py-3 border-b text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios?.map(usuario => (
                        <tr key={usuario._id} className="hover:bg-gray-100 hover:text-black">
                            <td className="px-6 py-4 border-b text-left">{usuario._id}</td>
                            <td className="px-6 py-4 border-b text-left">{usuario.nombre}</td>
                            <td className="px-6 py-4 border-b text-left">{usuario.correo}</td>
                            <td className="px-6 py-4 border-b text-left">{usuario.rol}</td>
                            <td className="px-6 py-4 border-b text-center">
                                <div className="space-x-2">
                                    <Link href={`/users/${usuario._id}`} className="text-blue-500 hover:underline mr-4">Editar</Link>
                                    <button onClick={() => eliminarUsuario(usuario._id)} className="text-red-500 hover:underline cursor-pointer">Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
