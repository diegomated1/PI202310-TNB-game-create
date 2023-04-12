import mongoose from 'mongoose';
import db from '../database/mongo.db.js';

const LobbyModel = db.model('lobbies', new mongoose.Schema({
    _id: String,
    id_owner: String,
    max_number_players: Number,
    ias: Number,
    players: [{
        id_user: String, id_hero: String
    }],
    min_bet: Number
}));

export default LobbyModel;