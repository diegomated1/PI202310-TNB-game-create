import { Server } from "socket.io";

import matchController from "./controllers/match.controller.js";
import matchesController from "./controllers/matches.controller.js";

const io = new Server(3000, {
    cors: {
      origin: '*'
    }
});


io.on("connection", (socket) => {
  console.log("conectao");

  matchController(io, socket);
  matchesController(io, socket);

  socket.on("disconnect", ()=>{
    console.log("desconectao");
  });
});
