import express from "express";
import SocketIO from "socket.io"
import http from "http";

const app = express();
app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res)=> res.render("home"));
app.get("/*", (req, res)=> res.redirect("/"));
console.log("hello")
const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http server
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
  });
});
// const sockets = [];

// socket은 연결된 어떤 사람. 여결된 브라우저와의 컨택트
// wss.on("connection", (socket) =>{
//   sockets.push(socket);
//   socket["nickname"] = "cAnon"
//   console.log("Connected to Browser")
//   // 브라우저 창이 닫히면 연결이 끊기면서 해당 콘솔로그 찍힘
//   socket.on("close", () => {
//     console.log("Disconnected from the Browser")
//   })
//   // 브라우저로부터 메세지를 받으면 콘솔로그
//   socket.on("message", msg => {
//     const message = JSON.parse(msg.toString('utf8'));
//     switch(message.type) {
//       case "new_message":
//         sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//     // 다른 소켓들에게 메세지를 보내준다
//     // sendback
//     // socket.send(message.toString('utf8'))
//   })
//   socket.send("hello!!!");
// })

httpServer.listen(3000, handleListen);