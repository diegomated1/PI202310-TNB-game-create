import {Server, Socket} from 'socket.io';
import LobbyModel from '../models/lobby.model.js';
import ui from 'uniqid';
export default class LobbyListeners{
    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket){
        this.socket = socket;
        this.io = io;
        this.listeners();
    }

    private start(id_lobby:string){
        try{
            this.io.of('/lobby').to(`lobby:${id_lobby}`).emit("lobby:start");
        }catch(error){
            console.log(error);
        }
    }

    /**
     * Function for event when user create game/lobby
     * @param {string} id_owner id of the user who create the game
     * @param {string} id_hero id of the hero of the owner
     * @param {number} ias amount of ias in the game
     * @param {number} max_number_players max number of players in the game
     * @param {number} min_bet min bet of the game
     */
    private createLobby = async (
        id_owner:string, id_hero:string, ias:number, max_number_players:number, min_bet:number
        ) => {
        try{
            const id_lobby = ui.process(); 
            const lobby = await LobbyModel.create({
                _id: id_lobby,
                id_owner, ias, min_bet, max_number_players,
                players: [{id_user: id_owner, id_hero}]
            });
            this.socket.join(`lobby:${id_lobby}`)
            this.io.of('/lobby').emit('lobby:create', lobby);
        }catch(error){
            this.socket.emit('lobby:create');
            console.log(error);
        }
    }
    
    /**
     * Function for event when user want to join a new lobby
     * @param {string} id_user id of the user who want join the lobby
     * @param {string} id_lobby id of the lobby who want join the user
     */
    private userJoin = async (id_user:string, id_hero:string, id_lobby:string)=>{
        try{
            const lobby = await LobbyModel.findById(id_lobby);
            if(lobby){
                const act_players = lobby.players.length + lobby.ias!;
                if(act_players<lobby.max_number_players!){
                    const _player = lobby.players.find(player=>player.id_user==id_user);
                    if(_player) return;
                    lobby.players.push({id_user, id_hero});
                    await lobby.save();
                    this.socket.join(`lobby:${id_lobby}`);
                    this.io.of('/lobby').to(`lobby:${id_lobby}`).emit("lobby:user:join", id_user);
                }else{
                    this.socket.emit('lobby:user:join');
                }
            }
        }catch(error){
            console.log(error);
        }
    };

    /**
     * Function for event when user want to leave a lobby
     * @param {string} id_user id of the user who want leave the lobby
     * @param {string} id_lobby id of the lobby who want leave the user
     */
    private async userLeave (id_user:string, id_lobby:string){
        try{
            const lobby = await LobbyModel.findById(id_lobby);
            if(lobby){
                await lobby.updateOne({'$pull': {players: id_user}});
                this.socket.leave(`lobby:${id_lobby}`);
                this.io.of('/lobby').to(`lobby:${id_lobby}`).emit("lobby:user:leave", id_user);
            }
        }catch(error){
            console.log(error);
        }
    };

    listeners(){
        this.socket.on("lobby:create", this.createLobby);
        this.socket.on("lobby:start", this.start);
        this.socket.on("lobby:user:join", this.userJoin);
        this.socket.on("lobby:user:leave", this.userLeave);
    }
}