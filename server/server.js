import http from "http";
import Express from "express";
import { Server } from "socket.io";

const publicPath = path.join(__dirname, "/../client");

const PORT = 5000;

const app = Express();
const server = http.createServer(app);
const io = new Server(server);

app.use(Express.static("../client/"));

io.on("connection", (socket) => {
  console.log("A new User is connected");
  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });

  if (io.engine.clientsCount > 18 && !admin) {
    socket.emit("show-max-concurrent-connections-message");
    socket.conn.close();
    return;
  } else {
    socket.emit("hide-max-concurrent-connections-message");
  }
  socket.emit("bootstrap", socket.id);

  socket.broadcast.emit("user-update", {
    socketId: socket.id,
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
