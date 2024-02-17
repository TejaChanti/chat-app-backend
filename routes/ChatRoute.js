import express from 'express';
import chatController from '../controller/chatController.js';
import authToken from '../middleware/authtoken.js';

const router = express.Router();

// private
router.post('/create', authToken, chatController.accessChat)
router.get('/get', authToken, chatController.fetchChats)
router.post('/group', authToken, chatController.createGroupChat)
router.put('/rename', authToken, chatController.renameGroup)
router.put('/groupremove', authToken, chatController.removeFromGroup)
router.put('/groupadd', authToken, chatController.addToGroup)


export default router

