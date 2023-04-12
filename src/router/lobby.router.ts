import { Router } from "express";
import LobbyController from "../controllers/lobby.controller.js";

export default class LobbyRouter{

    router: Router
    private controller: LobbyController

    constructor(){
        this.router = Router();
        this.controller = new LobbyController();
        this.routes();
    }

    private routes(){
        this.router.route('/').get(this.controller.get);
        this.router.route('/:id_lobby').get(this.controller.getById);
    }
}