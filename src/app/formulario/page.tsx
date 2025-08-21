'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

// Esquema de validación con Zod
const FormularioSchema = z.object({
  cedula: z.string().min(10, "La cédula debe tener 10 dígitos").max(10, "La cédula debe tener 10 dígitos"),
  nombre: z.string().min(3, "El nombre debe tener al menos tres caracteres").max(100, "El nombre debe tener menos de 100 caracteres"),
  monto: z.number().positive("El monto debe ser un número positivo"),
})

// Tipo de datos del formulario
interface FormularioData {
  cedula: string;
  nombre: string;
  monto: number;
}

export default function FormularioPage() {

  const [registros, setRegistros] = useState<FormularioData[]>([])

  const [paginaActual, setPaginaActual] = useState(1)
  const REGISTROS_POR_PAGINA = 5

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioData>({
    resolver: zodResolver(FormularioSchema),
  })

  const onSubmit = (data: FormularioData) => {
    setRegistros(prev => [...prev, data])
    reset()
    setPaginaActual(1) // Vuelve a la primera página al agregar
  }

  // Paginación
  const indiceInicio = (paginaActual - 1) * REGISTROS_POR_PAGINA
  const indiceFin = indiceInicio + REGISTROS_POR_PAGINA
  const registrosPaginados = registros.slice(indiceInicio, indiceFin)
  const totalPaginas = Math.ceil(registros.length / REGISTROS_POR_PAGINA)

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina)
    }
  }

  return (
    <main className="mx-auto max-w-xl py-10 px-4">
      <h1 className="font-bold text-2xl mb-6">Formulario de Registro de Pagos</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded">
        <div>
          <label className="font-medium block">Cédula</label>
          <input type="text" {...register('cedula')} className="w-full border p-2 rounded" />
          {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula.message}</p>}
        </div>

        <div>
          <label className="font-medium block">Nombre</label>
          <input type="text" {...register('nombre')} className="w-full border p-2 rounded" />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="font-medium block">Monto</label>
          <input
            type="number"
            step="0.01"
            {...register('monto', { valueAsNumber: true })}
            className="w-full border p-2 rounded"
          />
          {errors.monto && <p className="text-red-500 text-sm">{errors.monto.message}</p>}
        </div>

        <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
          Registrar
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Registros</h2>
        {registros.length === 0 ? (
          <p className="text-gray-500">No hay registros aún.</p>
        ) : (
          <>
            <ul>
              {registrosPaginados.map((registro, index) => (
                <li key={index} className="border-b p-3">
                  <p><strong>Cédula:</strong> {registro.cedula}</p>
                  <p><strong>Nombre:</strong> {registro.nombre}</p>
                  <p><strong>Monto:</strong> ${registro.monto.toFixed(2)}</p>
                </li>
              ))}
            </ul>

            {totalPaginas > 1 && (
              <div className="flex justify-center mt-4 gap-2 items-center">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="px-3 py-1 bg-gray-900 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm font-medium">{`Página ${paginaActual} de ${totalPaginas}`}</span>
                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="px-3 py-1 bg-gray-900 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
