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
  // Método para crear un nuevo usuario
  static create({ username, password }) {
    // Validaciones de entrada (opcional usar zod)
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')

    // Verificar si el usuario ya existe
    const user = User.findOne({ username })
    if (user) throw new Error('Username already exists')

    // Crear nuevo usuario
    const id = crypto.randomUUID()
    // eslint-disable-next-line no-undef
    const hashedPassword = bcrypt.hashSync(password, SALT)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()
    return id
  }

  // Método para iniciar sesión
  static login({ username, password }) {
    // Validar entrada
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (typeof password !== 'string') throw new Error('Password must be a string')

    // Verificar credenciales del usuario
    const user = User.findOne({ username })
    if (!user || user.password !== password) throw new Error('Invalid username or password')

    // Lógica de inicio de sesión exitosa
    return { message: 'Login successful', userId: user._id }
  }
}
