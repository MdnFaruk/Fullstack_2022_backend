const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const [exec_path,file_name,password,name,number] = process.argv

const url =
  `mongodb+srv://faruk:${password}@cluster0.lmqjm.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name || number !== undefined ) {
    Person.create({name:`${name}`, number:`${number}`}, (err,data) => {
        err ? console.error(err) : console.log(`added ${data.name} number ${data.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(data => {
        console.log(`phonebook:`)
        data.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}



/* const person = new Person({
  name: 'Faruk',
  number: '019812345',
})
person.save().then(result => {
  console.log('person saved!')
  console.log(result)
  mongoose.connection.close()
}) */