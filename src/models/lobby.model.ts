import mongoose from 'mongoose';

const LobbyModel = mongoose.model('lobbies', new mongoose.Schema({
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