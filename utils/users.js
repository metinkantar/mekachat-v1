const users = [];

// Kullanıcıyı sohbete bağlama
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Mevcut kullanıcıyı alma
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// Sohbetten ayrılma
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Odadaki kullanıcı listesini alma
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
