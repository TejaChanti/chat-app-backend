import UserModel from '../model/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { uploadFile, deleteFile, getObjectSignedUrl } from '../config/S3config.js'
import dotenv from 'dotenv'

import multer from 'multer'
dotenv.config({ path: '../.env' })

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })



const userSignup = async (req, res) => {
    let { name, email, phone,password,profileImage} = req.body;
    
    profileImage = "";

    const emailExists = await UserModel.findOne({ email })
    const phoneExists = await UserModel.findOne({ phone })
    if (emailExists) {
      res.status(400).send({ "status": "failed", "message": "Email already exists" })
      return
    }
    if(phoneExists){
        res.status(400).send({ "status": "failed", "message": "Phone Number already exists" })
        return
    }
    

    
    try {
      const file = req.file
        if(file!=null){
          const imageName = email
          await uploadFile(file.buffer, imageName, file.mimetype)
         profileImage = await getObjectSignedUrl(imageName)
      
    }
            const salt = await bcrypt.genSalt(12)
            const hashPassword = await bcrypt.hash(password, salt)
            const newUser = new UserModel({
              name: name,
              email: email,
              phone:phone,
              password: hashPassword,
              profileImage:profileImage
            })
           const user = await newUser.save()
            if(user){
                res.status(201).send({ "status": "Sucess", "message": " Register","user":user})
            }
          } catch (error) {
            console.log(error)
            res.status(500).send({ "status": "failed", "message": "Unable to Register Due to InternalserverError" })
          }

  }

  const userLogin = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await UserModel.findOne({
            $or: [{ email: email }, { phone: email }],
          });

        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if (isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

            res.status(200).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              profileImage: user.profileImage,
              token: token,
            });
          } else {
            res.status(400).send({ "status": "failed", "message": "Email or Password is not Valid" })
          }
        } else {
          res.status(404).send({ "status": "failed", "message": "You are not a Registered User" })
        }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({ "status": "failed", "message": "Unable to Login" })
    }
  }

  const deleteUser = async (req, res) => {
    const  userId  = req.params.userid
    console.log(userId)
    

    try {
        
      
   

      if(req.user_id===userId){
       const data =  await UserModel.findByIdAndDelete(userId)
        res.status(200).send({ "status": "success", "message": "User Successfully Deleted","res":data})
      }
 else {
          res.status(404).send({ "status": "failed", "message": "You are not authorizied Person" })
        }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({ "status": "failed", "message": "Unable to Delete" })
    }
  }

  const updateUser = async (req, res) => {
    let { userId,name,profileImage} = req.body
    
      let file = req.file

    try {
        
      

      const user = await UserModel.findById(userId)      

     
      


      if(user!=null && req.user_id===userId){
        if(file){
          const imageName = user.email
        await uploadFile(file.buffer, imageName, file.mimetype)
       profileImage = await getObjectSignedUrl(imageName)
         
        }
        const data = await UserModel.updateOne({ _id: userId }, {
          $set: {
            name: name,
            profileImage: profileImage,
          }
        })
          
            if (data) {
              let ans = await UserModel.findById(userId)
              res.status(200).send({ "status": "success", "message": "User Successfully Updated", "user":ans})              
            } else {
              console.error(err);
            }
          
      }
 else {
          res.status(404).send({ "status": "failed", "message": "User details are not Valid Please check!!" })
        }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({ "status": "failed", "message": "Unable to Update" })
    }
  }


  const allUsers = async (req, res) => {
    try {
      const keyword = req.query.search
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
  
      const users = await UserModel.find({ ...keyword, _id: { $ne: req.user._id } });
  
      res.status(200).json(users);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  export default { userSignup, userLogin, deleteUser, updateUser, allUsers};