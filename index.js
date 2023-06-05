const express = require("express")
const cors = require("cors")
const {mongooseConnection} = require("./commen/dbconfig")
const tasks = require("./Routes/users")
const app = express()
const PORT = 7000

mongooseConnection()

app.use(cors())
app.use(express.json())
app.use("/user",tasks)

app.listen(PORT,()=>console.log(`Server is running on ${PORT}`))