const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> \n${new Date()}`)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {  
    const body = request.body
    const isNameExist = persons.some(person => person.name === body.name )
    const errorMessage = isNameExist ? 'name must be unique' : 'name or number is missing'
    if (!body.name || !body.number || isNameExist) {
      return response.status(400).json({ 
        error: errorMessage
      })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generatePersonId(),
      }  
    persons = [...persons, person]  
    response.json(person)
})

const generatePersonId = () => {
    const randomId = () => Math.floor(Math.random() * 1000) + 1;
    return randomId()
  }
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})