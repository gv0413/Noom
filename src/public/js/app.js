const socket = io();
const myFace = document.getElementById("myFace");

const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
  try{
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === "videoinput")
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach(camera => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if(currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option)
    })
  } catch(e) {
    console.log(e);
  }
}
async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: {facingMode : "user"},
  }
  
  const cameraConstrains = {
    audio: true,
    video: {deviceId : {exact: deviceId}}
  }

  try{
    myStream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstrains : initialConstrains)
    myFace.srcObject = myStream;
    if(!deviceId) {
      await getCameras();
    }
  }
  catch(e) {
    console.log(e);
  }
}

function handleMuteClick() {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled)
  if(!muted) { 
    muteBtn.innerText = "UnMute"
    muted = true
  } else {
    muteBtn.innerText = "Mute"
    muted = false
  }
}

function handleCameraClick() {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled)
  if(cameraOff) { 
    cameraBtn.innerText = "Turn Camera Off"
    cameraOff = false
  } else {
    cameraBtn.innerText = "Turn Camera On"
    cameraOff = true
  }
}

async function handleCamerasChange() {
  await getMedia(camerasSelect.value)
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCamerasChange);

// Welcome Form (join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}


async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = ""
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket code

// peer A에서 실행됨 
socket.on("welcome", async()=> {
  // 시그널링 프로세스를 시작할 때, call을 시작 하는 유저가 offer 란 것을 만든다. 
  // 이 offer는 세션 정보를 SDP 포맷으로 가지고 있으며, 커넥션이 이어지기를 원하는 유저(callee)에게 전달되어야 한다. 
  // Callee 는 이 offer에 SDP description을 포함하는 answer 메세지를 보내야한다.
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer")
  socket.emit("offer", offer, roomName);
})

// peer B에서 실행됨 
socket.on("offer", async(offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  console.log(answer)
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
})

// peer A에서 실행됨
socket.on("answer", answer => {
  myPeerConnection.setRemoteDescription(answer);
})

// RTC Code 
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
}