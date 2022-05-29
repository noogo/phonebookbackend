const mongoose = require('mongoose')


const [, , password, name, number] = process.argv

const url = `mongodb+srv://noogoo:${password}@phonebook.rjb8e.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({ name, number })

// person.save().then(result => {
//     console.log(result)
//     mongoose.connection.close()
// })

Person.find({}).then(persons => {
    persons.forEach(person => console.log(person))
    mongoose.connection.close()
})
