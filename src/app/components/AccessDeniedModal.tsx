'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function AccessDeniedModal() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])
    const handleClose = () => {
        setIsOpen(false)
        router.back()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative z-10 bg-white rounded-lg shadow-x1 max-w-md w-full p-6 text-center animate-fade-in">
                <h2 className="text-2x1 font-bold text-red-600 mb-4"> Acceso Denegado</h2>
                <p className="text-gray-700 mb-6">No tienes permisos para acceder a esta sección.</p>
                <button
                    onClick={handleClose}
                    className="bg-blue-600 text-white px-4 py-2 rountded hover:bg-blue-700 cursor-pointer"
                >
                    Volver
                </button>
            </div>
        </div>
    )
}