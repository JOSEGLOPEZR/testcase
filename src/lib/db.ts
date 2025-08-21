import Database from 'better-sqlite3'
import { config } from 'dotenv'
import path from 'path'

// Carga variables del .env
config()

// Usa la ruta desde .env o una por defecto
const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), 'src/data/pagos.db')

export const db = new Database(dbPath)
