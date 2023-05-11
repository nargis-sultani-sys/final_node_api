const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema(
    {
    code: {
            type: String,
            required: true,
            unique: true
        },
        funfacts: [String],
    
    },
    {
        collection: "state"
    }
);

module.exports = mongoose.model('state', stateSchema);
