const express = require("express");
const app = express();
const session = require("express-session");
const socketIO = require("socket.io");
require("dotenv").config({
  path: '../.env'
});
const cors = require("cors");
const socketUtils = require("./utils/socketUtils");

const authRoute = require("./routes/auth");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const cartRoute = require("./routes/cart");
const analyticsRoute = require("./routes/analytics");
const employeesRoute = require("./routes/employees");
const userRoute = require("./routes/user");
const mapsRoute = require("./routes/maps");

// set up the express session config
let TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "sessionSecret",
  cookie: { maxAge: TWO_HOURS_IN_MS },
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use("/api", productsRoute);
app.use("/api", ordersRoute);
app.use("/api", cartRoute);
app.use("/api", ordersRoute);
app.use("/api", analyticsRoute);
app.use("/api", employeesRoute);
app.use("/api", userRoute);
app.use("/api", mapsRoute);

const PORT = process.env.PORT || 8888;
const server = app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

// register socket.io to server
const io = socketIO(server, {
  cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
  },
});

// Create namespaces


// Register with middleware and make socket avaiable everywhere
io.engine.use(sessionMiddleware);
app.set('io', io); 
