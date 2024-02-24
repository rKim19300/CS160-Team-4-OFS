const express = require("express");
const app = express();
const session = require("express-session");
const dotenv = require('dotenv').config()
const cors = require("cors");

const authRoute = require("./routes/auth");
// const productsRoute = require("./routes/products");

// set up the express session config
let TWO_HOURS_IN_MS = 2*60*60*1000;
app.use(session({
    secret: process.env.SESSION_SECRET || "sessionSecret",
    cookie: { maxAge: TWO_HOURS_IN_MS },
    resave: false,
    saveUninitialized: false,
}));

// CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

// parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
// app.use("/api", productsRoute);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});
