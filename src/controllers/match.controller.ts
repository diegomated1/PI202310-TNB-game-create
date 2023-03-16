import {Server, Socket} from 'socket.io';
import ui from 'uniqid';
import GameModel from '../models/game.model.js';

const matchController = (io: Server, socket: Socket) => {

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
        io.emit("match:create", new_game.toJSON());
    }

    socket.on("match:create", matchCreate);
};

export default matchController;