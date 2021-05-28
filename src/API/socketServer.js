const httpServer = require("http").createServer();
const whatsapp = require("../WhatsAppInstance/client");
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: false
    }
});

io.on("connection", (socket) => {
    console.log(socket.id);
    whatsapp.initializeClient(socket);
});

httpServer.listen(5000, () => {
    console.log('Socket Is Online . . .')
});
