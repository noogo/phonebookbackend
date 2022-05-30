const express = require('express')
const app = express()
app.use(express.static('build'))
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
app.use(cors())
app.use(express.json())
const morgan = require('morgan')
const Person = require('./models/person')


morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {
    res.send('<h1>hello</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons)).catch(err => console.log(err.message))
})

app.get('/api/info', (req, res, next) => {
    // const count = persons.length
    // const date = new Date()
    // res.send(
    //     `<p> Phonebook has info for ${count} people</p><p>${date}</p>`
    // )
    Person.find({}).then(persons => persons.length).then(count => {
        const date = new Date()
        res.send(`<p>Phonebook has info for ${count} people</><p>${date}</p>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result => {
        res.status(204).end()
    }).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    Person.find({ name: body.name }).then(persons => {
        console.log(persons)
        if (persons.length === 0) {
            const person = new Person({
                name: body.name,
                number: body.number
            })
            person.save().then(person => res.json(person)).catch(err => next(err))
        } else {
            res.status(400).send({ error: `${body.name} is already in the phonebook!` })
        }
    })


})

app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true }).then(updatePerson => {
        res.json(updatePerson)
    }).catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown point' })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.log(err.name)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => { console.log(`Server is runing on port ${PORT}`) })