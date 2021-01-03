const express = require('express')
require('./db/mongoose') //simply starts the mongoose.connect() in mongoose.js
const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouters')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app