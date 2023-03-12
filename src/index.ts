import { Server } from "socket.io";

import roomController from "./controllers/room.controller.js";

const io = new Server(3000, {
    cors: {
      origin: '*'
    }
});


io.on("connection", (socket) => {

    roomController(io, socket);

    socket.on("disconnect", ()=>{
      console.log("disconnected");
    });
});
