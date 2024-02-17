
import UserModel from '../model/User.js'

const usertoadmin = async (req, res) => {
  
  let userId = req.params.userid

  try {
      
    console.log(userId)
    const user = await UserModel.findById(userId)      
    console.log(user)
    if(user!=null){
      const data = await UserModel.updateOne({ _id: userId }, {
        $set: {
          role:"admin",
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


const admintouser = async (req, res) => {
  
  let userId = req.params.userid

  try {
      

    const user = await UserModel.findById(userId)      

    if(user!=null){
      const data = await UserModel.updateOne({ _id: userId }, {
        $set: {
          role:"user",
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


const deleteUser = async (req, res) => {
    const  userId  = req.params.userid
 
    

    try {
        
 
   
      const user = await UserModel.findById(userId)      

      if(user!=null){
       const data =  await UserModel.findByIdAndDelete(userId)
        res.status(200).send({ "status": "success", "message": "User Successfully Deleted","res":data})
      }
 else {
          res.status(404).send({ "status": "failed", "message": "You User data is Not avaliable" })
        }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({ "status": "failed", "message": "Unable to Delete" })
    }
  }

  const updateUser = async (req, res) => {
    let { userId,name,profileImage} = req.body
    let token = req.token
    let file = req.file
    try {
        
  

      const user = await UserModel.findById(userId)      

      if(user!=null){
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

  export default { deleteUser, updateUser,admintouser, usertoadmin};
