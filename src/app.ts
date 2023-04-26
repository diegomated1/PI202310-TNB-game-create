import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';
import http from 'http';
import io from 'socket.io';
import LobbyRouter from './router/lobby.router.js';
import LobbyListeners from './listeners/lobby.listeners.js';
import cors from 'cors';
import mongoDb from './database/mongo.db.js';
class App{

    app: Application
    server: http.Server
    io: io.Server

    constructor(){
        this.app = express();
        this.server = new http.Server(this.app);
        this.io = new io.Server(this.server, {
            cors: {
                origin: '*'
            },
            path: '/lobby/'
        });
        this.config();
        this.routes();
        this.start();
    }

    config(){
        dotenv.config();
        new mongoDb().connect();
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use('/lobbies', new LobbyRouter().router);
    }

    start(){
        this.io.on('connection', (socket)=>{
            const {id_lobby} = socket.handshake.query;
            if(id_lobby){
                socket.join(`lobby:${id_lobby}`);
            }
            new LobbyListeners(this.io, socket);
        });

        this.server.listen(parseInt(process.env.API_PORT||'3000'));
    }

}

const app = new App();