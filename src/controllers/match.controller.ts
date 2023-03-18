import {Server, Socket} from 'socket.io';
import GameModel from '../models/game.model.js';

/**
 * Controller for managing lobby
 * @param {Server} io the socket server
 * @param {Socket} socket the socket
 */
const matchController = (io: Server, socket: Socket) => {

    /**
     * Function for event when user want to join a new match
     * @param {string} id_user id of the user who want join the lobby
     * @param {string} id_match id of the match who want join the user
     */
    const matchUserJoin = async (id_user:string, id_match:string)=>{
        const match = await GameModel.findById(id_match);
        if(match){
            if((match.players!.length+match.ias!)<match.max_number_players!){
                var _player = match.players.find(player=>player.id_user==id_user);
                if(_player) return;
                match.players.push({id_user, bet: 0});
                await match.save();
                socket.emit("match:user:join", id_user, match);
                io.to(`match:${id_match}`).emit("match:user:join", id_user, match);
            }
        }
    };

    /**
     * Function for event when user want to leave a match
     * @param {string} id_user id of the user who want leave the lobby
     * @param {string} id_match id of the match who want leave the user
     */
    const matchUserLeave = async (id_user:string, id_match:string)=>{
        const match = await GameModel.findById(id_match);
        if(match){
            match.players = match.players.filter(player=>player.id_user!=id_user);
            await match.save();
            socket.leave(`match:${id_match}`);
            socket.to(`match:${id_match}`).emit("match:user:leave", id_user, match);
        }
    };

    const matchStart = async (id_user:string, id_match:string)=>{
        const match = await GameModel.findById(id_match);
        if(match){
            
            io.emit("match:start", id_user);
        }
    };

    // socket events
    socket.on("match:user:join", matchUserJoin);
    socket.on("match:user:leave", matchUserLeave);
    socket.on("match:start", matchStart);
};

export default matchController;