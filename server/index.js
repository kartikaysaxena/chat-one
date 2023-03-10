var Buffer = require('buffer/').Buffer

const convert = (from, to) => str => Buffer.from(str, from).toString(to)




const hexToUtf8 = convert('hex', 'utf8')
const decrypted = hexToUtf8('736b2d565354414b524861453062736b414537415252385433426c626b464a47784653434f4f724d64566f4d5944787667706e')












const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require('path')
app.use(cors());
app.use(express.static(path.join(__dirname + "/public")))

const port = process.env.PORT || 3001

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    data.key = decrypted
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`SERVER RUNNING on ${port}`);
});