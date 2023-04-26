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

    private start = async (id_lobby:string, id_game:string) => {
        try{
            await LobbyModel.findByIdAndDelete(id_lobby);
            this.io.emit("lobby:deleted", id_lobby);
            this.io.to(`lobby:${id_lobby}`).emit("lobby:start", id_game);
        }catch(error){
            console.log(error);
        }
    }

    /**
     * Function for event when user create game/lobby
     * @param {IPLayer} owner
     * @param {number} ias amount of ias in the game
     * @param {number} max_number_players max number of players in the game
     * @param {number} min_bet min bet of the game
     */
    private createLobby = async (
        owner:string, ias:number, max_number_players:number, min_bet:number
        ) => {
        try{
            const id_lobby = ui.process(); 
            const lobby = await LobbyModel.create({
                _id: id_lobby,
                id_owner: owner, ias, min_bet, max_number_players,
                players: [owner]
            });
            this.io.emit('lobby:create', lobby);
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
    private userJoin = async (player:string, id_lobby:string)=>{
        try{
            const lobby = await LobbyModel.findById(id_lobby);
            if(lobby){
                const act_players = lobby.players.length + lobby.ias!;
                if(act_players<lobby.max_number_players!){
                    const _player = lobby.players.find(_player=>_player==player);
                    if(_player) return;
                    lobby.players.push(player);
                    await lobby.save();
                    this.socket.emit("lobby:user:join", player, id_lobby);
                    this.io.to(`lobby:${id_lobby}`).emit("lobby:user:join", player, id_lobby);
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
    private  userLeave = async (id_user:string, id_lobby:string) => {
        try{
            const lobby = await LobbyModel.findById(id_lobby);
            console.log(lobby);
            if(lobby){
                if(lobby.players.length==1){
                    await lobby.deleteOne();
                    this.io.emit("lobby:deleted", id_lobby);
                }else{
                    lobby.players = lobby.players.filter(_player=>_player!=id_user);
                    await lobby.save();
                }
                this.io.to(`lobby:${id_lobby}`).emit("lobby:user:leave", id_user);
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