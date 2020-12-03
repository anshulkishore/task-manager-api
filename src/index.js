const express = require('express')
require('./db/mongoose') //simply starts the mongoose.connect() in mongoose.js
const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouters')
const { update } = require('./models/user')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server is up on port '+ port)
})