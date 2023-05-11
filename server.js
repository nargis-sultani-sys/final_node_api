require('dotenv').config();
const express = require("express");
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const app = express();
const path = require('path');

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./states/routes/rootRoutes'));
require("./states/routes/statesRoutes")(app);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        console.log(__dirname);
       
        res.sendFile(path.join(__dirname, 'views', '404.html'));
       
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
