import {Server, Socket} from 'socket.io';
import GameModel from '../models/game.model.js';

const matchController = (io: Server, socket: Socket) => {

    const matchUserJoin = async (id_user:string, id_match:string)=>{
        const match = await GameModel.findById(id_match);
        if(match){
            var new_match = await GameModel.updateOne(
                {_id: id_match},
                {$push: {
                    players: {id_user, bet: 0}
                }},
                {new: true}
            );
            console.log(new_match);
            socket.join(`match:${id_match}`);
            socket.to(`match:${id_match}`).emit("match:user:join", id_user);
        }
    };

    const matchUserLeave = async (id_user:string, id_match:string)=>{
        const match = await GameModel.findById(id_match);
        if(match){
            var new_match = await GameModel.updateOne(
                {_id: id_match},
                {$pull: {
                    players: {id_user}
                }},
                {new: true}
            );
            socket.leave(`match:${id_match}`);
            socket.to(`match:${id_match}`).emit("match:user:leave", id_user);
        }
    };

    const matchStart = async (id_user:string, id_match:string)=>{
        const match = await GameModel.findById(id_match);
        if(match){
            var new_match = await GameModel.updateOne(
                {_id: id_match},
                {$pull: {
                    players: {id_user}
                }},
                {new: true}
            );
            io.emit("match:start", id_user);
        }
    };

    socket.on("match:user:join", matchUserJoin);
    socket.on("match:user:leave", matchUserLeave);
    socket.on("match:start", matchStart);
};

export default matchController;