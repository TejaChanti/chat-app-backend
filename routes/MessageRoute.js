import express from 'express';
import messageController from '../controller/messageController.js';
import authToken from '../middleware/authtoken.js';


const router = express.Router();

// private
router.get('/:chatId', authToken, messageController.allMessages)
router.post('/send', authToken, messageController.sendMessage)


export default router