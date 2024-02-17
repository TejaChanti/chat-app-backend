import jwt from 'jsonwebtoken'
import UserModel from '../model/User.js'

const verifyAdmin = async (req, res, next) => {
    
    let token = req.token
  console.log(token+" hello")
    if (token) {
      try {
        
        const  {userId:userID}  = jwt.verify(token, process.env.JWT_SECRET_KEY)
   
        const user = await UserModel.findById(userID) 
 
        if (user.role==="admin") {
            next()
          }
        else{
            res.status(401).send({ "status": "failed", "message": "Admin Users Only!" })
        }
       
      } catch (error) {
        console.log(error)
        res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
      }
    }
    else{
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }

  }
  export default verifyAdmin