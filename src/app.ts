import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';
import http from 'http';
import io from 'socket.io';
import LobbyRouter from './router/lobby.router.js';
import LobbyListeners from './listeners/lobby.listeners.js';
import cors from 'cors';

class App{

    app: Application
    server: http.Server
    io: io.Server
    LobbyRouter: LobbyRouter

    constructor(){
        this.app = express();
        this.server = new http.Server(this.app);
        this.io = new io.Server(this.server, {
            cors: {
                origin: '*'
            }
        });
        this.LobbyRouter = new LobbyRouter();
        this.config();
        this.routes();
        this.start();
    }

    config(){
        dotenv.config();
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use('/lobbies', this.LobbyRouter.router);
    }

    start(){
        this.io.on('connection', (socket)=>{
            console.log("conectado");
            new LobbyListeners(this.io, socket);
            socket.on('disconnect', () => {
                console.log('desconectado');
            }); 
        });

        this.server.listen(3000, ()=>{
            console.log("Server on port 3000");
        });
    }

}

const app = new App();