import {Server, Socket} from 'socket.io';
import ui from 'uniqid';

const roomController = (io: Server, socket: Socket) => {

    const roomCreate = (id_user:string)=>{
        const new_room = {owner: id_user, id: ui.process};

        io.emit("room:create", new_room);
    }

    socket.on("room:create", roomCreate);
};

export default roomController;