import UserModel from '../model/User.js'
import jwt from 'jsonwebtoken'

const authToken = async (req, res, next) => {
    const  authorization  = req.headers['authorization']
        
    if (authorization && authorization.startsWith('Bearer')) {
      try {
        // Get Token from header
        let token = authorization.split(' ')[1];
        if (!token) {
            res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
          }
          const  userID  = jwt.verify(token, process.env.JWT_SECRET_KEY)
         // console.log(userID);
          const user = await UserModel.findById(userID.userId) 
          if(user){
            req.user = user;
            next()
          }
          else{
            res.status(400).send({ "status": "failed", "message": "Bad Request!!!" })
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
  export default authToken