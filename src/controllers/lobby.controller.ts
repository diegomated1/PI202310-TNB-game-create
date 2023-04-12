import { Request, Response } from "express";
import LobbyModel from "../models/lobby.model.js";
import ui from 'uniqid';

export default class LobbyController{

    constructor(){
    }

    async get(req:Request, res:Response){
        try{
            const lobbies = await LobbyModel.find();
            res.status(200).json({data: lobbies});
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

    async getById(req:Request, res:Response){
        try{
            const {id_lobby} = req.params;
            const lobby = await LobbyModel.findById(id_lobby);
            if(lobby){
                res.status(200).json({data: lobby});
            }else{
                res.status(404).json({'message': 'Game not found'});
            }
        }catch(error){
            res.status(500).json({'message': 'Internal error server'});
        }
    }

}