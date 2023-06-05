const mongoose = require("mongoose")


exports.mongooseConnection = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGODB_CONNECTION_URL)
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log(error)
    }
    
}