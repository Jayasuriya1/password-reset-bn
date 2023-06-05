const express = require("express")
const cors = require("cors")
const {mongooseConnection} = require("./commen/dbconfig")
const tasks = require("./Routes/users")
const app = express()
require('dotenv').config()

mongooseConnection()

app.use(cors())
app.use(express.json())
app.use("/user",tasks)

app.listen(process.env.PORT,()=>console.log(`Server is running on ${process.env.PORT}`))