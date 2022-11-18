const express = require('express')
const bodyParser = require('body-parser')
const {request, response} = require("express");
const app = express()
const db = require('./postgresCRUD')
const port = process.env.PORT || 9999 ;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended:true,
    })
)

app.get('/', (request, response) => {
        response.json({info: 'Our class is live.'})
})

app.get('/users', db.getUsers)
app.post('/users', db.createUser)
/* Delete user with Post */
app.post('/delUser', db.deleteUser)
/* Delete user user Delet method */
app.delete('/users/:id', db.delUser)
/* update user using PUT method */
app.put('/users/:id', db.updateUser)
/* get single user info */
app.get('/userbyId/:id', db.getUserbyId)
/* work on salesforce object */
app.post('/users/sales', db.createUserSalesforce)


app.listen(port,() => {
    console.log(`App is running on port ${port}.`)
})