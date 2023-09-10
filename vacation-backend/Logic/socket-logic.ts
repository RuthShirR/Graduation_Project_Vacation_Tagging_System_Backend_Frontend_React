import { Server, Socket } from "socket.io";

// ==============================
// FUNCTIONS FOR SOCKET LOGIC
// ==============================


let socketsManager: Server;

// Starts the Socket.IO server
function start(listener: any) {
  // Initialize the Socket.IO server with CORS settings
  socketsManager = new Server(listener, { cors: { origin: "http://localhost:3000" } });

  // Event listener for when a new client connects
  socketsManager.sockets.on("connection", (socket: Socket) => {

    // Event listener for when client sends an "add-active" event
    socket.on("add-active-from-client", (vacation: any) => {
      socketsManager.sockets.emit("add-active-from-server", vacation);
    });

    // Event listener for when client sends an "update-active" event
    socket.on("update-active-from-client", (vacation: any) => {
      socketsManager.sockets.emit("update-active-from-server", vacation);
    });

    // Event listener for when client sends a "delete-active" event
    socket.on("delete-active-from-client", (uuid: string) => {
      socketsManager.sockets.emit("delete-active-from-server", uuid);
    });

  });
}

// ==========================
// EXPORTED MODULE FUNCTIONS
// ==========================

export {
  start
};
