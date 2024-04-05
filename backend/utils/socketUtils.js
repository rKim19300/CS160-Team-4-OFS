const socketIO = require("socket.io");
const { UserType, SocketRoom } = require("../enums/enums");
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");

// -- Attributes -- 
let io;
let staffIO;
let customerIO;

// -- Functions -- 
/**
 * Connects socket.io to the server 
 * MUST be called in app.js before any other function
 * 
 * @param {*} server             The express server
 * @param {*} sessionMiddleware  The express session middleware 
 */
const sio = async (server, sessionMiddleware) => {
  // Connect socket.io to server 
  try {
    // Only created a new IO instance if it has not already been created
    if (!io) {
      io = await socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
      });

      // Create the namespaces
      staffIO = await io.of('/staff');
      customerIO = await io.of('/customer');
    }

    // Add session middleware
    await io.engine.use(sessionMiddleware);

    // Connect to main socket
    await io.on("connection", (socket) => {
      console.log(`Client connected main [id=${socket.id}]`);  

      socket.on('disconnect', () => {
        console.log(`Client disconnected main [id=${socket.id}]`);
      });
    });
  }
  catch (err) {
    console.error(`SOCKET ERROR: ${err}`);
  }
};

/**
 * Connects user to socket.io session, will connect to staff namespace if they have it
 * 
 * @param {*} user  The user represented in the databae
 */
const connectUser = async (user) => {
  try {
    socket.request.session.user = user;
    const session = socket.request.session;
    (user && user.user_type >= UserType.EMPLOYEE) ? 
      await connectStaff(session) : await connectCustomer(session);
  }
  catch (err) {
    console.error(`SOCKET ERROR: ${err}`);
  }
};

// Private to the module
const connectStaff = async (session) => {
  try {
    await staffIO.on("connectionStaff", (socket) => {
      console.log(`User connected (ID: ${session.user.user_id})`);
      console.log(`Client connected staff [id=${socket.id}]`);

      // Place the users into rooms upon logging in 
      socket.join(SocketRoom.STAFF_ROOM);
      socket.join(SocketRoom.CUSTOMER_ROOM);

      socket.on('disconnect', () => {
        console.log(`Client disconnected [id=${socket.id}, user_id=${session.user.user_id}]`);
      });
    });
  }
  catch (err) {
    console.error(`SOCKET ERROR: ${err}`);
  }
}

// Private to the module
const connectCustomer = async (session) => {
  try {
    await customerIO.on("connectionCustomer", (socket) => {
      console.log(`User connected (ID: ${session.user.user_id})`);
      console.log(`Client connected customer [id=${socket.id}]`);

      // Place the users into room
      socket.join(SocketRoom.CUSTOMER_ROOM);

      socket.on('disconnect', () => {
        console.log(`Client disconnected [id=${socket.id}, user_id=${session.user.user_id}]`);
      });
    });
  }
  catch (err) {
    console.error(`SOCKET ERROR: ${err}`);
  }
}


module.exports = { sio, connectUser };