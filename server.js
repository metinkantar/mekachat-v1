const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessages = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const { SocketAddress } = require("net");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Statik olarak klasör yolumuzu belirtmek
app.use(express.static(path.join(__dirname, "public")));

const botName = "MeKaChat Bot";

// İstemci bağlandığında gerçekleştireceğimiz bağlantılar
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //Hoşgeldiniz mesajı
    socket.emit(
      "message",
      formatMessages(botName, "MeKaChat 'e Hoşgeldiniz...")
    );

    // Bir kullanıcı bağlandığında yapılacaklar
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessages(botName, `${user.username} kullanıcısı sohbete katıldı.`)
      );

    // Kullanıcıları ve oda bilgilerini gönderme
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessages(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessages(
          botName,
          `${user.username} kullanıcısı sohbetten ayrıldı.`
        )
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(
    `${PORT} numaralı port adresinden gelen istekler dinleniliyor...`
  );
});
