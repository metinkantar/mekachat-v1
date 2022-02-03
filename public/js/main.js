const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Kullanıcı ve Oda ismi Query String sayesinde almak
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// odaya giriş
socket.emit("joinRoom", { username, room });

// oda ve kullanıcıyı alma
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll yüksekliğini alma
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Mesaj metninin almak
  const msg = e.target.elements.msg.value;
  // Sunucuya mesaj göndermek
  socket.emit("chatMessage", msg);
  // input alanını boşaltma
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Mesajı chat'e iletme
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li class="mekaUsers">${user.username}</li>`).join("")}
  `;
}
