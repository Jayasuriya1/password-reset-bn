const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{
            type:String,
            required:true,
            lowercase:true,
            validate:(value)=>{
                return validator.isEmail(value)
            }
        },
        password:{type:String,required:true},
        token:{type:String,default:""}

    }
)

const UserModel = mongoose.model('user',userSchema)
module.exports = {UserModel}