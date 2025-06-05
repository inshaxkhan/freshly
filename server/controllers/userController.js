import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

// Register user:  /api/user/register
export const register=async(req, res)=>{
    try {
        //if any detail is missing
        const {name, email, password}=req.body;
        if(!name || !email || !password){
            return res.json({success:false, message: 'Missing Details'})
        }

        //if user already exists
        const existingUser=await User.findOne({email})
        if(existingUser)
            return res.json({success:false, message:'User Already Exists'})

        //encrypt user password using bcrypt & store 
        const hashedPassword=await bcrypt.hash(password, 10)

        //create a new user
        const user=await User.create({name, email, password:hashedPassword})

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})

        res.cookie('token',token, {
            httpOnly: true,  // prevent js to access cookie
            secure: process.env.NODE_ENV==='production',    //use secure cookie in prod
            sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',  //CSRF protection
            maxAge:7*24*60*60*1000,
        })

    } catch (error) {
        
    }
}