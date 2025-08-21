import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Pago {
  id: number
  cedula: string
  nombre: string
  monto: number
  programa: string
  periodo: string
}

export async function GET(
  request: NextRequest,
  context: { params: { cedula: string } }
) {
  try {
    const { cedula } = context.params

    if (!cedula || cedula.length !== 10) {
      return NextResponse.json({ error: 'Cédula inválida' }, { status: 400 })
    }

    const pagos: Pago[] = await new Promise((resolve, reject) => {
      try {
        const stmt = db.prepare('SELECT * FROM pagos WHERE cedula = ?')
        const result = stmt.all(cedula) as Pago[]
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })

    if (pagos.length === 0) {
      return NextResponse.json({ error: 'No se encontraron pagos' }, { status: 404 })
    }

    return NextResponse.json({ pagos })
  } catch (error) {
    console.error('Error en la API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
