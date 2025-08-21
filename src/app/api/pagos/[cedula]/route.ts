import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 👇 Esta es la forma correcta de declarar el handler
export async function GET(
  request: NextRequest,
  context: { params: { cedula: string } }
) {
  try {
    const { cedula } = context.params

    if (!cedula || cedula.length !== 10) {
      return NextResponse.json({ error: 'Cédula inválida' }, { status: 400 })
    }

    const stmt = db.prepare('SELECT * FROM pagos WHERE cedula = ?')
    const pagos = stmt.all(cedula)

    if (pagos.length === 0) {
      return NextResponse.json({ error: 'No se encontraron pagos' }, { status: 404 })
    }

    return NextResponse.json({ pagos })
  } catch (error) {
    console.error('Error en la API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
