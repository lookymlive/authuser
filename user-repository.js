import crypto from 'node:crypto'
import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { SALT } from './config.js'

// Inicializar la base de datos local
const { Schema } = new DBLocal({ path: './db' })

// Definir el esquema para los usuarios
const User = Schema('users', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  /**
   * Método para crear un nuevo usuario
   * @param {Object} user - Objeto con las propiedades username y password
   * @param {string} user.username - Nombre de usuario
   * @param {string} user.password - Contraseña
   * @throws {Error} Si el nombre de usuario o la contraseña no son válidos
   * @returns {string} El ID del usuario creado
   */
  static create({ username, password }) {
    // Validaciones de username y password de entrada (opcional usar zod)
    if (typeof username !== 'string') {
      throw new Error('Username must be a string')
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long')
    }
    if (typeof password !== 'string') {
      throw new Error('Password must be a string')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    // ADEGURARSE DE QUE EL USUARIO NO EXISTE
    const existingUser = User.findOne({ username })
    if (existingUser) {
      throw new Error('Username already exists')
    }

    // Crear nuevo usuario
    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, SALT)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }
}
