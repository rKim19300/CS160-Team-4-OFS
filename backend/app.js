const express = require("express");
const app = express();
const session = require("express-session");
const socketIO = require("socket.io");
require("dotenv").config({
  path: '../.env'
});
const cors = require("cors");
const { DB } = require("./database");
const { checkIsStaff } = require("./middleware/authMiddleware");

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
const staffIO = io.of('/staff');

// Register with middleware and make sockets avaiable everywhere
io.engine.use(sessionMiddleware);
staffIO.use((socket, next) => {
  checkIsStaff(socket.client.request, socket.client.request.res, next);
});
app.set('io', io); 
app.set('staffIO', io); 

// Create a thread that assigns routes to robots
const fiveSeconds = 5000;
setInterval(async () => {

  // Query the database for the robots and routes
  let robots = await DB.get_all_robots();
  let routes = await DB.get_all_routes();

  // In a for loop check if either of the robots doesn't have a route
  let route_start = 0; // Index where you should start searching for routes
  for (let i = 0; i < robots.length; i++) {

    // Assign a route to a robot, robot doesn't already have a route
    if (!(await DB.has_route(robots[i].robot_id))) {
      for (let j = route_start; j < routes.length; j++) {

        // Find a route that doesn't already have a robot assigned to it
        if (!(await DB.has_robot(routes[j].route_id))) {
          DB.set_route_to_robot(routes[j].route_id, robots[i].robot_id);
          console.log(`Robot ID (${robots[i].robot_id}) has been assinged route ID (${routes[j].route_id})`);
          route_start = j + 1; // Start + 1 where last route was assigned
          break;
        }

      }
    }
  }
}, fiveSeconds);
