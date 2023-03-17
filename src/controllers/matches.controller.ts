import {Server, Socket} from 'socket.io';
import ui from 'uniqid';
import GameModel from '../models/game.model.js';

const matchesController = (io: Server, socket: Socket) => {

    const matchCreate = async (id_user:string, number_players:number, ias:number, bet:number)=>{
        const id_game = ui.process(); 
        const new_game = await GameModel.create({
            _id: id_game,
            id_owner: id_user,
            ias,
            max_number_players: number_players,
            min_bet: bet,
            players: {id_user, bet}
        });
        socket.join(`match:${id_game}`);
        io.emit("match:create", new_game.toJSON());
    }

    const matchGetOne = async (id_user:string, id_match:string)=>{
        try{
            const match = await GameModel.findOne({_id: id_match, "players.id_user": id_user});
            if(match){
                socket.emit('match:get:one', match);
            }else{
                socket.emit('match:get:one');
            }
        }catch(error){
            socket.emit('match:get:one', 1);
        }
    } 
    
    socket.on("match:create", matchCreate);
    socket.on("match:get:one", matchGetOne);
};

export default matchesController;