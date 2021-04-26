
;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  /**
   * Utilisateur connecté à la socket
   */
   var loggedUser;

/**
   * Connexion d'un utilisateur via le formulaire
   */
 socket.on('user-login', function (loggedUser) {
  console.log('user logged in : ' + loggedUser.username);
  user = loggedUser;
});
 /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    message.username = loggedUser.username; // On intègre ici le nom d'utilisateur au message
    io.emit('chat-message', message);
    console.log('Message de : ' + loggedUser.username);
  });

  /**
 * Réception d'un message
 */
socket.on('chat-message', function (message) {
  $('#messages').append($('<li>').html('<span class="username">' + message.username + '</span> ' + message.text));
});

/**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
 socket.on('disconnect', function () {
  if (loggedUser !== undefined) {
    console.log('user disconnected : ' + loggedUser.username);
    var serviceMessage = {
      text: 'User "' + loggedUser.username + '" disconnected',
      type: 'logout'
    };
    socket.broadcast.emit('service-message', serviceMessage);
  }
});

/**
 * Connexion d'un utilisateur via le formulaire :
 *  - sauvegarde du user
 *  - broadcast d'un 'service-message'
 */
socket.on('user-login', function (user) {
  loggedUser = user;
  if (loggedUser !== undefined) {
    var serviceMessage = {
      text: 'User "' + loggedUser.username + '" logged in',
      type: 'login'
    };
    socket.broadcast.emit('service-message', serviceMessage);
  }
});
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    
  });
  
});

 http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
