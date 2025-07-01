// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black-100">
      <div>
        <h1 className="text-2xl font-bold" >Bienvenido, {session?.user?.nombre}</h1>
        <br />
        <br />
        <div className="flex justify-center space-x-10">
          <Link href="/tasks" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Tareas</Link>
          <Link href="/users" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Usuarios</Link>
        </div>
      </div>
    </main>


  );
}
