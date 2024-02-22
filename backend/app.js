const express = require("express");
const app = express();
const session = require("express-session");
const { db } = require("./database");
const dotenv = require('dotenv').config()

const authRoute = require("./routes/auth");

// set up the express session config
let TWO_HOURS_IN_MS = 2*60*60*1000;
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: TWO_HOURS_IN_MS },
    resave: false,
    saveUninitialized: false,
}));

// parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoute);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});
