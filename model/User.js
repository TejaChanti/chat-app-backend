import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true,required: true},
  phone: { type: String, unique: true,required: true},
  password: { type: String, required: true, trim: true },
  profileImage: {type:String},
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
},
{ timestaps: true })


// Model
const UserModel = mongoose.model("User", userSchema)

export default UserModel