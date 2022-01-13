const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
  })
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}


function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#message");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // 백엔드 처리가 끝났으면 FE에서 실행될 함수를 가장 마지막 인자에 넣는다.
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user)=> {
  addMessage(`${user} arrived!`);
})

socket.on("bye", (left)=> {
  addMessage(`${left} left ㅜㅜ`);
})

socket.on("new_message", addMessage);