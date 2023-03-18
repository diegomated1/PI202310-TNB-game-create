import {Server, Socket} from 'socket.io';
import ui from 'uniqid';
import GameModel from '../models/game.model.js';

/**
 * Controller for managing matches
 * @param {Server} io the socket server
 * @param {Socket} socket the socket
 */
const matchesController = (io: Server, socket: Socket) => {

    /**
     * Function for event when user create a new match
     * @param {string} id_user id of the use who want create a new match
     * @param {number} number_players max number of players in the match
     * @param {number} ias number of IAs in the match
     * @param {number} bet amount of credits to bet
     */
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
        io.emit("match:create", new_game);
    }

    /**
     * Function for event to obtain a match which the user is in a match
     * @param {string} id_user id of the user in a match
     * @param {string} id_match id of the match
     */
    const matchGetOne = async (id_user:string, id_match:string)=>{
        try{
            const match = await GameModel.findOne({_id: id_match, "players.id_user": id_user});
            if(match){
                socket.join(`match:${id_match}`);
                socket.emit('match:get:one', match);
            }else{
                socket.emit('match:get:one');
            }
        }catch(error){
            socket.emit('match:get:one', 1);
        }
    }
    
    /**
     * Function for event to obtain all matches
     */
    const matchGetAll = async ()=>{
        try{
            const matches = await GameModel.find();
            socket.emit('match:get:all', matches);
        }catch(error){
            socket.emit('match:get:all');
        }
    } 

    // socket events
    socket.on("match:create", matchCreate);
    socket.on("match:get:one", matchGetOne);
    socket.on("match:get:all", matchGetAll);
};

export default matchesController;