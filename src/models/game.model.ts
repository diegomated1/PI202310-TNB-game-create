import mongoose from 'mongoose';
import db from '../database/mongo.db.js';

const GameModel = db.model('games', new mongoose.Schema({
    _id: String,
    id_owner: String,
    max_number_players: Number,
    ias: Number,
    players: Array<{id_user: String, bet: Number}>,
    min_bet: Number
}));

export default GameModel;