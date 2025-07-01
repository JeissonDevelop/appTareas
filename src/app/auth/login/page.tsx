'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import PasswordInput from '@/app/components/PasswordInput';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ correo: '', contrasena: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            correo: form.correo,
            contrasena: form.contrasena,
            callbackUrl: '/dashboard',
        });

        if (res?.error) {
            setError('Correo o contraseña incorrectos');
        } else {
            router.push(res?.url || '/dashboard');
        }
    };

    return (
        <main className="flex items-center justify-center h-screen bg-black-100">
            <form onSubmit={handleSubmit} className="bg-black p-6 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-white">Iniciar Sesión</h1>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={form.correo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <PasswordInput
                    name="contrasena"
                    placeholder="Contraseña"
                    value={form.contrasena}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-2 rounded mt-4"
                >
                    Iniciar Sesion
                </button>

                <div className="mt-2 text-center">
                    ¿No tienes cuenta?
                    <a href="/auth/register" className="text-blue-400 underline">
                        Regístrate
                    </a>
                </div>
            </form>
        </main>
    );
}
