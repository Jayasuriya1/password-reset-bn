const express = require('express')
const { UserModel } = require('../Schema/schema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWTD = require("jwt-decode");
const router = express.Router()
const secretKey = "a#pmd1j$h3*dh@!"
const nodemailer = require('nodemailer')
const { application } = require('express')


router.post("/signup", async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(!user){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            req.body.password = hashedPassword
            const user = await UserModel.create(req.body)
            res.status(200).json({
                message:"User Signup Successfully"
            })
        }else{
            res.status(400).json({
                message:"User Already Exists"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})

router.post("/login",async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(user){
            if(await bcrypt.compare(req.body.password,user.password)){
                res.status(200).json({
                    message:"User Login Successfully",
                })
            }else{
                res.status(400).json({
                    message:"Invaild Password"
                })
            }
            
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error
        })
    }
})

router.post("/forget-password",async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(user){
            const secret = secretKey+user._id
            console.log("Step1: secret",secret)
            console.log(user.email)
            const token = await jwt.sign({email:user.email,id:user._id},secret,{expiresIn:"3min"})
            const link = `http://localhost:3000/resetPassword/${user._id}/${token}`;
            user.token=token
            await user.save()

            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:'jaya1999suriya1@gmail.com',
                    pass:'hmvqjdoimsvuyeux'
                },
                tls: {
                    rejectUnauthorized: false
                }
          
            })

            const message ={
                from:"norepay.jayasuriya",
                to:user.email,
                subject:"Password reset request",
                html:`<h2>Hello ${user.name}</h2>
                <p>We've recieved a request to reset the password for your account associated with your email.
                You can reset your password by clicking the link below</p>
                <a href=${link}> Reset Password</a>
                <p><b>Note:</b>The link expires 15 minutes from now</p>
                `
            }

            transporter.sendMail(message,(err,info)=>{
                if(err){
                    console.log(err)
                    res.status(400).json({
                        message:"Something went wrong, Try again later",
                        err
                    })
                }else{
                    res.status(200).json({
                        message:"Password Reset link sent to your mail"
                    })
                }
            })

        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
})


router.post("/reset-password/:id/:token",async(req,res)=>{
    
    const {id,token} = req.params
    const user = await UserModel.findOne({_id:id})
    const secret =secretKey+user._id
    
    const decode = await JWTD(token);

    if(Math.round((new Date())/1000)<=decode.exp){
        try {
            if(user && (user.token==token)){
                const verify = jwt.verify(token,secret)
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password, salt)
                user.password = hashedPassword
                user.token = ""
                await user.save()
                res.status(200).json({
                    message:"User Password Changed Successfully",
                })
            }else{
                res.status(200).json({
                    message:"Invaild link",
                })
            }
            
        } catch (error) {
            res.status(500).json({
                message:"Internal Server Error",
                error
            })
        }
    }else{
        res.json({
            message:"link experied"
        })
    }
        
    
})

router.get("/:id",async(req,res)=>{
    try {
        const user = await UserModel.findOne({_id:req.params.id})
        if(user){
            res.status(200).json({
                message:"Data Fetched Successfully",
                user
            })
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error ok"
        })
    }
})
router.get("/",async(req,res)=>{
    try {
        const user = await UserModel.find()
        if(user){
            res.status(200).json({
                message:"Data Fetched Successfully",
                user
            })
        }else{
            res.status(400).json({
                message:"User Does't Exist"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

module.exports=router