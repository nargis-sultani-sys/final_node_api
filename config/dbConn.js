const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
        //await mongoose.connect('mongodb+srv://nargissultani:CAPVKUq0toUe3WgD@my-cluster.iohjtuz.mongodb.net/states?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB
