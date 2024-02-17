import express from 'express';
import userController from '../controller/UserController.js';
import authToken from '../middleware/authtoken.js';
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const router = express.Router();

// public 
router.post('/signup', upload.single('profileImage'), userController.userSignup)
router.post('/login', userController.userLogin)

// private
router.delete('/delete/:userid', authToken, userController.deleteUser)
router.put('/update', authToken, userController.updateUser)
router.get('/get', authToken, userController.allUsers)


export default router