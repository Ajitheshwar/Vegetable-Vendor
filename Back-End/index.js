const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: "../.env" });
const PORT = process.env.PORT || 3000;

const signup_router = require("./routes/signinRouter");
const login_router = require("./routes/loginRouter");
const resetPasswordRouter = require("./routes/resetPassword")
const userAPIRoute = require("./routes/user/user");
const adminRouter = require("./routes/admin/admin")

const DBUsername = process.env.DBUsername;
const DBPassword = process.env.DBPassword;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Front-End")));

mongoose
  .connect(
    `mongodb+srv://${DBUsername}:${DBPassword}@cluster0.vtlq8ra.mongodb.net/vegetable-vendor`,
    {useNewUrlParser: true, useUnifiedTopology : true}
  )
  .then((res) => {
    console.log("Database Connection Successfull");
  });

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});


app.use("/signup", signup_router);
app.use("/login", login_router);
app.use("/resetPassword",resetPasswordRouter)

app.use("/admin", adminRouter);
app.use("/user", userAPIRoute);


//sockets
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5502", "http://127.0.0.1:5502"],
  },
});

let users = [];

function getSocketIdOfUser(user) {
  for (let a of users) {
    if (a.user == user) {
      return a.id;
    }
  }
  return "-1";
}

function addUserAndSocketId(user, socketId) {
  users.push({ user: user, id: socketId });
}

function removeUserAndSocketId(socketId) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === socketId) {
      users.splice(i);
      return;
    }
  }
}

server.listen(PORT, () => {
  console.log("Server Listening on port : 3000");
});

io.on("connection", (socket) => {
  socket.on("update", (user) => {
    addUserAndSocketId(user, socket.id);
    // console.log(user + " added successfully" + socket.id)
    //console.log(users)
  });

  socket.on("send message", (msg) => {
    // console.log(msg.receiver)
    let socketId = getSocketIdOfUser(msg.receiver);
    let obj = {
      message: msg.message,
      sender: msg.sender,
      time: msg.time,
      user: msg.user,
    };
    io.to(socketId).emit("message", obj);
  });

  socket.on("disconnect", () => {
    // console.log("a user disconnected")
    removeUserAndSocketId(socket.id);
  });
});

module.exports = { app };
