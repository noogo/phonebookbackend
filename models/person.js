const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url).then(result => console.log('connected to MongoDB!')).catch(err => { console.log(err.message) })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        // validate: {
        //     validator: async (v) => {
        //         const persons = await Person.find({ name: v })
        //         console.log('persons:', persons, 'persons.length:', persons.length)
        //         if (persons.length !== 0) {
        //             console.log('执行了')
        //             return false
        //         }
        //     },
        //     message: '{VALUE} is already in the phonebook!'
        // },
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return (/\d{2}-\d{6,}/.test(v) || /\d{3}-\d{5,}/.test(v))
            },
            message: '{VALUE} is invalidate number'
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person