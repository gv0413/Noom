import express from "express";
import WebSocket from "ws";
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
const server = http.createServer(app)

// ws server
// http 서버 위에 ws 서버를 만들도록 하기 위해 server를 만들었고, 해당 객체에 접근할 수 있도록 함
const wss = new WebSocket.Server({server})

const sockets = [];

// socket은 연결된 어떤 사람. 여결된 브라우저와의 컨택트
wss.on("connection", (socket) =>{
  sockets.push(socket);
  console.log("Connected to Browser")
  // 브라우저 창이 닫히면 연결이 끊기면서 해당 콘솔로그 찍힘
  socket.on("close", () => {
    console.log("Disconnected from the Browser")
  })
  // 브라우저로부터 메세지를 받으면 콘솔로그
  socket.on("message", message => {
    // 다른 소켓들에게 메세지를 보내준다
    sockets.forEach(aSocket => aSocket.send(message.toString('utf8')))
    
    // sendback
    // socket.send(message.toString('utf8'))
  })
  socket.send("hello!!!");
})

server.listen(3000, handleListen);