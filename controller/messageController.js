import ChatModel from '../model/Chat.js'
import UserModel from '../model/User.js'
import MessageModel from '../model/Message.js'

const allMessages = async (req, res) => {
    try {
      const messages = await MessageModel.find({ chat: req.params.chatId })
        .populate("sender", "name profileImage email")
        .populate("chat");
  
      res.status(200).json(messages);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

const sendMessage = async (req, res) => {
    try {
      const { content, chatId } = req.body;
  
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
  
      let newMessage = {
        sender: req.user._id,
        content:content,
        chat: chatId,
      };
  
      let message = await MessageModel.create(newMessage);

      message = await message.populate("sender", "name profileImage");
      message = await message.populate("chat");

  
      await UserModel.populate(message, {
        path: "chat.users",
        select: "name profileImage email",
      });
  
      await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });
     
      res.status(200).json(message);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export default {allMessages,sendMessage};