const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
  console.log("The backend says :", msg)
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // 백엔드 처리가 끝났으면 FE에서 실행될 함수를 가장 마지막 인자에 넣는다.
  socket.emit("enter_room", input.value, backendDone);
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);