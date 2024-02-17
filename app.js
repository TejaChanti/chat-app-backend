import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/dataBaseConn.js'
import Userrouter from './routes/UserRoute.js';
import Adminrouter from './routes/AdminRoute.js';
import Chatrouter from './routes/ChatRoute.js';
import Messagerouter from './routes/MessageRoute.js';
import { Server } from 'socket.io';



dotenv.config({ path: '../.env' });
const app = express()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL


// CORS Policy
app.use(cors())

// Database Connection
connectDB(DATABASE_URL)

// JSON
app.use(express.json())


// Load Routes
app.use("/api/user",Userrouter)
app.use("/api/admin",Adminrouter)
app.use("/api/chat", Chatrouter);
app.use("/api/message", Messagerouter);

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);



const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});