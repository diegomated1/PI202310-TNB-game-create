import {Server, Socket} from 'socket.io';
import GameModel from '../models/game.model.js';

export default class LobbyListeners{
    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket){
        this.socket = socket;
        this.io = io;
        this.listeners();
    }

    /**
     * Function for event when user want to join a new match
     * @param {string} id_user id of the user who want join the lobby
     * @param {string} id_match id of the match who want join the user
     */
    private async matchUserJoin (id_user:string, id_match:string){
        try{
            const match = await GameModel.findById(id_match);
            if(match){
                const act_players = match.players.length + match.ias!;
                if(act_players<match.max_number_players!){
                    const _player = match.players.find(player=>player==id_user);
                    if(_player) return;
                    match.players.push(id_user);
                    await match.save();
                    this.socket.join(`match:${id_match}`);
                    this.io.to(`match:${id_match}`).emit("match:user:join", id_user);
                }
            }
        }catch(error){
            console.log(error);
        }
    };

    /**
     * Function for event when user want to leave a match
     * @param {string} id_user id of the user who want leave the lobby
     * @param {string} id_match id of the match who want leave the user
     */
    private async matchUserLeave (id_user:string, id_match:string){
        try{
            const match = await GameModel.findById(id_match);
            if(match){
                await match.updateOne({'$pull': {players: id_user}});
                this.socket.leave(`match:${id_match}`);
                this.io.to(`match:${id_match}`).emit("match:user:leave", id_user);
            }
        }catch(error){
            console.log(error);
        }
    };

    listeners(){
        this.socket.on("match:user:join", this.matchUserJoin);
        this.socket.on("match:user:leave", this.matchUserLeave);
    }
}