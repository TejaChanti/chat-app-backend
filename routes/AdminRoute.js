import verifyAdmin from "../middleware/verifyadmin.js";
import authToken from '../middleware/authtoken.js';
import express from 'express';
import adminController from "../controller/adminController.js";


const router = express.Router();



// private
router.delete('/delete/:userid', authToken, verifyAdmin, adminController.deleteUser)
router.put('/update', authToken, verifyAdmin, adminController.updateUser)
router.put('/usertoadmin/:userid', authToken, verifyAdmin, adminController.usertoadmin)
router.put('/admintouser/:userid', authToken, verifyAdmin, adminController.admintouser)

export default router