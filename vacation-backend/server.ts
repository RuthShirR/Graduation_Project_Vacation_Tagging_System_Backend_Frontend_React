import express from "express";
import cors from "cors"
import config from "./Utils/Config";
import ErrorHandler from "./MiddleWare/route-not-found";
import { myBanner } from "./Utils/banner";
import usersRouter from "./Routes/users-routes";
import authRouter from "./Routes/auth-routes";
import vacationsRouter from "./Routes/vacation-routes";
import followersRouter from "./Routes/followers-routes";
import { start as startSocketIO } from "./Logic/socket-logic"; 
import http from "http"; 

// ==========================
// SERVER
// ==========================

const server = express();

// Middleware and settings
server.use(cors()); 
server.use(express.json()); 
server.use(express.static("user_videos")); 

// API routes
server.use("/api/auth", authRouter); 
server.use("/api/users", usersRouter); 
server.use("/api/vacations", vacationsRouter); 
server.use("/api/vacations/followers", followersRouter); 

// Error handlers
server.use("*", ErrorHandler); 
server.use(ErrorHandler);

console.log(myBanner); 

let httpServer: http.Server;

// Start the server on the configured port and enable Socket.IO
export function startServer() {
    if (!httpServer) {
        httpServer = server.listen(config.WebPort, () => {
            console.log(`listening on http://${config.mySQLhost}:${config.WebPort}`); });
        startSocketIO(httpServer);
    }
}
 //Gracefully shut down the server
export function closeServer() {
    if (httpServer) {
      httpServer.close(() => {
        console.log("Server closed");
      });
    }
  }

startServer()

export default server;
