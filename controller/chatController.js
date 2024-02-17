import ChatModel from '../model/Chat.js'
import UserModel from '../model/User.js'


const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.status(400).json("UserId param not sent with request");
    }

    let isChat = await ChatModel.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage.sender", "name profileImage email");

    if (isChat) {
   
      return res.status(200).json(isChat);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await ChatModel.create(chatData);

    const fullChat = await ChatModel.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

 
    res.status(200).json(fullChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to create or access chat" });
  }
};


const fetchChats = async (req, res) => {
    try {
      ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "name profileImage email",
        });
        res.status(200).send(results);
      });
    } catch (error) {
        console.log(error)
        res.status(500).json({ "status": "failed", "message": "Unable to featch Due to InternalserverError" })
      }

}


const createGroupChat = async (req, res) => {
    try {
      const { users, name } = req.body;
  
      if (!users || !name) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }
      
      const parsedUsers = JSON.parse(users);
  
      if (parsedUsers.length < 2) {
        return res.status(400).json({ message: "More than 2 users are required to form a group chat" });
      }
  
      const updatedUsers = [...parsedUsers, req.user];
  
      const groupChat = await ChatModel.create({
        chatName: name,
        users: updatedUsers,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}
  
  
const renameGroup = async (req, res) => {
    try {
      const { chatId, chatName } = req.body;
  
      const updatedChat = await ChatModel.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      if (!updatedChat) {
        return res.status(404).json({ message: "Chat not found" });
      }
  
      res.status(200).json(updatedChat);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}


const removeFromGroup = async (req, res) => {
    try {
      const { chatId, userId } = req.body;
  
      const removed = await ChatModel.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      if (!removed) {
        return res.status(404).json({ message: "Chat not found" });
      }
  
      res.status(200).json(removed);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  const addToGroup = async (req, res) => {
    try {
      const { chatId, userId } = req.body;
  
      const added = await ChatModel.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      if (!added) {
        return res.status(404).json({ message: "Chat not found" });
      }
  
      res.status(200).json(added);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


export default {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup,removeFromGroup};