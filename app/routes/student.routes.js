module.exports = (app) => {
    const students = require('../controllers/student.controller')

    var router = require('express').Router()

    // Retrieve all studens
    router.get('/', students.findAll)

    // Retrieve a single student with id
    router.get('/edit-student/:id', students.findOne)

    // Create a new student
    router.post('/create-student', students.create)

    // Update a student with id
    router.put('/update-student/:id', students.update)

    // Delete a student with id
    router.delete('/delete-student/:id', students.delete)

    app.use('/students', router)
}