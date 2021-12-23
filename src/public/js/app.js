// frontend 
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

// backend랑 연결해야 함 
// socket: 서버로의 연결
var socket = new WebSocket(`ws://${window.location.host}`)

// message is an event

///\ socket이 커넥션을 오픈했을 때
socket.addEventListener("open", ()=> {
  console.log("Connected to Server")
})

// socket이 메세지를 받았을 때
socket.addEventListener("message", (message)=> {
  console.log("New message: ", message.data);
})

// connection이 끊겼을 때
socket.addEventListener("close", () => {
  console.log("Disconnected from server")
})

// message fe to be
// setTimeout(()=> {
//   socket.send("hello from the browser!")
// }, 10000)

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  // form으로 be에 메세지 보내기 
  socket.send(input.value);
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit)