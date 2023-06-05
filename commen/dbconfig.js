const mongoose = require("mongoose")


exports.mongooseConnection = async()=>{
    try {
        const connection = await mongoose.connect(`mongodb+srv://jayasuriya:1999suriya@cluster0.6bctsuz.mongodb.net/users`)
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log(error)
    }
    
}