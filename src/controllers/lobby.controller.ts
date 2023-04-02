import { Request, Response } from "express";
import GameModel from "../models/game.model.js";
import ui from 'uniqid';

export default class LobbyController{

    constructor(){
    }

    async createLobby(req:Request, res:Response){
        try{
            const {id_user, ias, number_players, bet} = req.body;
            const id_game = ui.process(); 
            await GameModel.create({
                _id: id_game,
                id_owner: id_user,
                ias,
                max_number_players: number_players,
                min_bet: bet,
                players: [id_user]
            }); 
            res.status(200).json({'message': 'ok'});
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

    async get(req:Request, res:Response){
        try{
            const auctions = await GameModel.find();
            res.status(200).json({data: auctions});
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

    async getById(req:Request, res:Response){
        try{
            const {id_card} = req.params;
            const auction = await GameModel.findById(id_card);
            if(auction){
                res.status(200).json({data: auction});
            }else{
                res.status(404).json({'message': 'Game not found'});
            }
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

}