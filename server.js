
// npm install para descargar los paquetes...

// libreriuas
const validation = require('./libs/unalib');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// root: presentar html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// escuchar una conexion por socket
io.on('connection', function(socket){
  // si se escucha "chat message"
  socket.on('Evento-Mensaje-Server', function(msg){

    msg =  validation.validateMessage(msg);
    // volvemos a emitir el mismo mensaje
    io.emit('Evento-Mensaje-Server', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
