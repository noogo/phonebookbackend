const express = require("express")
const res = require("express/lib/response")
const morgan = require("morgan")
const cors = require('cors')



const app = express()
app.use(cors())
app.use(express.static('build'))

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

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {
    res.send('<h1>hello</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    const count = persons.length
    const date = new Date()
    res.send(
        `<p> Phonebook has info for ${count} people</p><p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const id = Math.floor(Math.random() * 10000000000000000)
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    const unique = persons.some(person => person.name === body.name)
    const error = { unique: 'name must be unique', missing: 'name or number missing' }
    if (unique) {
        res.json(error.unique)
    } else if (!(body.name && body.number)) {
        res.json(error.missing)
    } else {
        persons = persons.concat(person)
        res.json(person)
    }
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown point" })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => { console.log(`Server is runing on port ${PORT}`) })