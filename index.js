import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hola Luis y Familia</h1>')
})
app.post('/login', (req, res) => {
  res.json('Lookym the best')
})

app.post('/register', (req, res) => {
  const { username, password } = req.body
  console.log({ username, password })

  try {
    // eslint-disable-next-line no-undef
    const id = UserRepository.create({ username, password })
    res.send(id)
  } catch (error) {
    // NORMALMENTE NO ES BUENA IDEA MANDAR EL ERROR DEL REPOSITORIO AQUI
    // PORQUE ES UNA COSA DEL SERVIDOR Y NO DEL CLIENTE
    res.status(400).send(error.message)
  }
})
app.post('/logout', (req, res) => {

})

app.get('/protected', (req, res) => {
})

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
