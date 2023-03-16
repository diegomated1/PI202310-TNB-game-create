import { Server } from "socket.io";

import matchController from "./controllers/match.controller.js";

const io = new Server(3000, {
    cors: {
      origin: '*'
    }
});


io.on("connection", (socket) => {
  console.log("conectao");

  matchController(io, socket);

  socket.on("disconnect", ()=>{
    console.log("disconnected");
  });
});
