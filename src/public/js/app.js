const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`
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