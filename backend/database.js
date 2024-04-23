const sqlite3 = require("sqlite3").verbose();
const { UserType, OrderStatus, RobotStatus } = require("./enums/enums");

// db connection object
const db = new sqlite3.Database("db.db", (err) => {
    if (err) {
        return console.error(`Error while connecting to database: ${err.message}`);
    }
    console.log("Successfully connected to database");
    setup_tables();
});

// create a .query() method that allows us to run commands using async/await syntax
db.query = function (sql, params) {
    let that = this;
    return new Promise((resolve, reject) => {
        that.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

function setup_tables() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id         INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            email           VARCHAR(100) UNIQUE NOT NULL,
            username        VARCHAR(50) NOT NULL,
            password        VARCHAR(60) NOT NULL,
            user_type       INTEGER DEFAULT 0 NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Products (
            product_id      INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            name            VARCHAR(50) UNIQUE NOT NULL,
            description     TEXT NOT NULL,
            image_url       TEXT NOT NULL,
            price           REAL NOT NULL,
            weight          REAL NOT NULL,
            quantity        INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Orders (
            order_id        INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            user_id         INTEGER NOT NULL,
            cost            REAL NOT NULL,
            weight          REAL NOT NULL,
            address         VARCHAR(50) NOT NULL,
            delivery_fee    REAL NOT NULL,
            status          INTEGER DEFAULT 0 NOT NULL,
            created_at      TEXT NOT NULL,
            latitude        TEXT NOT NULL,
            longitude       TEXT NOT NULL,
            time_delivered  TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        );

        CREATE TABLE IF NOT EXISTS Order_items (
            order_id        INTEGER NOT NULL,
            product_id      INTEGER NOT NULL,
            quantity        INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES Orders(order_id),
            FOREIGN KEY (product_id) REFERENCES Products(product_id)
        );

        CREATE TABLE IF NOT EXISTS Categories (
            category_id     INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            name            VARCHAR(50) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Product_to_categories (
            product_id      INTEGER NOT NULL,
            category_id     INTEGER NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Products(product_id),
            FOREIGN KEY (category_id) REFERENCES Categories(category_id),
            UNIQUE (product_id, category_id)
        );

        CREATE TABLE IF NOT EXISTS Cart (
            cart_id         INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            user_id         INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        );

        CREATE TABLE IF NOT EXISTS Cart_items (
            cart_id         INTEGER NOT NULL,
            product_id      INTEGER NOT NULL,
            quantity        INTEGER NOT NULL,
            FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
            FOREIGN KEY (product_id) REFERENCES Products(product_id),
            UNIQUE (cart_id, product_id)
        );

        CREATE TABLE IF NOT EXISTS Robot (
          robot_id        INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
          route_id        INTEGER, /* Fill on order placed */
          latitude        TEXT NOT NULL,
          longitude       TEXT NOT NULL,
          weight          REAL DEFAULT 0 NOT NULL,
          status          INTEGER DEFAULT 0 NOT NULL, 
          FOREIGN KEY (route_id) REFERENCES Delivery_routes(route_id)
        );

        CREATE TABLE IF NOT EXISTS Delivery_routes (
          route_id        INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
          robot_id        INTEGER,
          created_at      TEXT NOT NULL, /* Fill on creation */
          FOREIGN KEY (robot_id) REFERENCES Robot(robot_id)
        );

        CREATE TABLE IF NOT EXISTS Route_to_orders (
          route_id        INTEGER NOT NULL,
          order_id        INTEGER NOT NULL,
          polyline        TEXT, /* Fill on route start */
          duration        INTEGER, /* Fill on route start */
          start_time      TEXT, /* Fill on route start */
          eta             TEXT, /* Fill on route start */
          leg             INTEGER, /* Fill on route start */
          FOREIGN KEY (route_id) REFERENCES Delivery_routes(route_id),
          FOREIGN KEY (order_id) REFERENCES Categories(order_id),
          UNIQUE (route_id, order_id)
        );
    `,
        (err) => {
            if (err) console.log(`Error while trying to setup the DB tables: ${err}`);
        }
    );
}

class DB {
    ///////
    // AUTH queries
    ///////
    static async get_user_from_email(email) {
        let q = await db.query("SELECT user_id, email, username, user_type FROM Users WHERE email = ?", [email]);
        return q[0];
    }

    static async insert_new_user(email, username, hashedPw, user_type = UserType.CUSTOMER) {
        await db.query("INSERT INTO Users(email, username, password, user_type) VALUES (?, ?, ?, ?)", [email, username, hashedPw, user_type]);
    }

    static async get_stored_password(email) {
        let q = await db.query("SELECT password FROM Users WHERE email = ?", [email]);
        return q[0].password;
    }

    ///////
    // USER queries
    ///////
    static async update_user_info(user_id, username, email) {
        await db.query("UPDATE Users SET username = ?, email = ? WHERE user_id = ?", [username, email, user_id]);
    }

    static async remove_user_by_id(user_id) {
        await db.query("DELETE FROM Users WHERE user_id = ?", [user_id]);
    }

    ///////
    // PRODUCTS queries
    ///////
    static async select_all_products() {
        let prods = await db.query("SELECT * FROM Products");
        for (let prod of prods) {
            prod["categories"] = await this.get_product_categories(prod.product_id);
        }
        return prods;
    }

    static async get_product_info(product_id) {
        let q = await db.query("SELECT * FROM Products WHERE product_id = ?", [product_id]);
        if (q.length === 0) {
            return { productInfo: null, errMsg: `Product with id ${product_id} does not exist` };
        }
        q[0]["categories"] = await this.get_product_categories(product_id);
        return { productInfo: q[0], errMsg: null };
    }

    static async add_new_product(name, description, image_url, price, weight, quantity) {
        await db.query("INSERT INTO Products(name, description, image_url, price, weight, quantity) VALUES (?, ?, ?, ?, ?, ?)", [name, description, image_url, price, weight, quantity]);
        // retrieve the product_id of the newly inserted product
        let lastInsertedProduct = await db.query("SELECT last_insert_rowid() as product_id");
        let product_id = lastInsertedProduct[0].product_id;
        return product_id;
    }

    static async update_product_info(product_id, name, description, image_url, price, weight, quantity) {
        await db.query("UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, weight = ?, quantity = ? WHERE product_id = ?", [name, description, image_url, price, weight, quantity, product_id]);
    }

    static async subtract_product_inventory_quantity(product_id, quantity) {
        await db.query("UPDATE Products SET quantity = quantity - ? WHERE product_id = ?", [quantity, product_id]);
    }

    static async get_products_with_category_name(category_name) {
        // get the category_id from the name
        let q = await db.query("SELECT category_id FROM Categories WHERE name = ?", [category_name]);
        if (q.length === 0) {
            return { prods: null, errMsg: `Category '${category_name}' does not exist` };
        }
        let category_id = q[0]["category_id"];
        let prods = await db.query("SELECT p.* FROM Products AS p INNER JOIN Product_to_categories AS ptc ON p.product_id = ptc.product_id WHERE ptc.category_id = ?", [category_id]);
        return { prods, errMsg: null };
    }

    ///////
    // PRODUCT CATEGORIES queries
    ///////
    static async add_new_category(name) {
        await db.query("INSERT INTO Categories(name) VALUES (?)", [name]);
    }

    static async get_all_categories() {
        let q = await db.query("SELECT * FROM Categories");
        return q;
    }

    static async set_product_categories(product_id, category_ids) {
        await db.query("DELETE FROM Product_to_categories WHERE product_id = ?", [product_id]);
        for (let category_id of category_ids) {
            await db.query("INSERT INTO Product_to_categories(product_id, category_id) VALUES (?, ?)", [product_id, category_id]);
        }
    }

    static async get_product_categories(product_id) {
        let q = await db.query("SELECT c.category_id, c.name FROM Product_to_categories AS ptc INNER JOIN Categories AS c ON ptc.category_id = c.category_id WHERE ptc.product_id = ?", [product_id]);
        return q;
    }

    ///////
    // CART queries
    ///////
    static async get_cart_id(user_id) {
        let q = await db.query("SELECT cart_id FROM Cart WHERE user_id = ?", [user_id]);
        if (q.length !== 0) return q[0]["cart_id"];
        await db.query("INSERT INTO Cart(user_id) VALUES (?)", [user_id]);
        let res = await db.query("SELECT cart_id FROM Cart WHERE user_id = ?", [user_id]);
        return res[0]["cart_id"];
    }

    static async insert_item_into_cart(cart_id, product_id, quantity) {
        await db.query("INSERT INTO Cart_items(cart_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT(cart_id, product_id) DO UPDATE SET quantity = quantity + ?", [cart_id, product_id, quantity, quantity]);
    }

    static async remove_item_from_cart(cart_id, product_id) {
        await db.query("DELETE FROM Cart_items WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);
    }

    static async get_cart_items(cart_id) {
        let q = await db.query("SELECT p.product_id, p.name, p.description, p.price, p.weight, p.image_url, p.quantity AS inventoryAmt, ci.quantity FROM Cart_items as ci INNER JOIN Products as p ON ci.product_id = p.product_id WHERE ci.cart_id = ?", [cart_id]);
        return q;
    }

    static async modify_cart_item_quantity(cart_id, product_id, quantity) {
        await db.query("UPDATE Cart_Items SET quantity = ? WHERE cart_id = ? AND product_id = ?", [quantity, cart_id, product_id]);
    }

    static async get_cart_weight(cart_id) {
        let q = await db.query("SELECT SUM(p.weight * ci.quantity) FROM Cart_Items as ci INNER JOIN Products as p ON ci.product_id = p.product_id WHERE ci.cart_id = ?", [cart_id]);
        return parseFloat(q[0]["SUM(p.weight * ci.quantity)"]) || 0;
    }

    static async get_cart_subtotal_cost(cart_id) {
        let q = await db.query("SELECT SUM(p.price * ci.quantity) FROM Cart_Items as ci INNER JOIN Products as p ON ci.product_id = p.product_id WHERE ci.cart_id = ?", [cart_id]);
        return parseFloat(q[0]["SUM(p.price * ci.quantity)"]) || 0;
    }

    static async delete_all_cart_items(cart_id) {
        await db.query("DELETE FROM Cart_items WHERE cart_id = ?", [cart_id]);
    }

    static async get_cart_item_quantity(cart_id, product_id) {
        let q = await db.query("SELECT quantity FROM Cart_items WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);
        return q.length > 0 ? parseInt(q[0]["quantity"]) : 0;
    }

    ///////
    // ORDER queries
    ///////
    static async select_all_orders() {
        let orders = await db.query("SELECT * FROM Orders");
        return orders;
    }

    static async get_user_order_history(user_id) {
        // TODO: FINISH THIS
    }
    /**
     * Adds and new Order to the data, as well as placing it on a route
     */
    static async add_new_order(user_id, cost, weight, address, delivery_fee, created_at, cart_id, latitude, longitude) {
        // inserts the order data into the `Orders` table and the `Order_items` table
        await db.query("INSERT INTO Orders(user_id, cost, weight, address, delivery_fee, created_at, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [user_id, cost, weight, address, delivery_fee, created_at, latitude, longitude]);
        // retrieve the last inserted order_id
        let lastInsertedOrder = await db.query("SELECT last_insert_rowid() as order_id");
        // extract the order_id
        let order_id = lastInsertedOrder[0].order_id;
        let cart_items = await db.query("SELECT product_id, quantity FROM Cart_items WHERE cart_id = ?", [cart_id]);
        for (let cart_item of cart_items) {
            let { product_id, quantity } = cart_item;
            await db.query("INSERT INTO Order_items(order_id, product_id, quantity) VALUES (?, ?, ?)", [order_id, product_id, quantity]);
        }

        // -- Place the order in a route --

        // Query the database for all routes and loop through them
        const routes = await this.get_all_routes();
        const MAX_ROUTE_WEIGHT = 200;
        const MAX_ROUTE_ORDERS = 10;

        for (let i = 0; i < routes.length; i++) {

            let route_id = routes[i].route_id;

            // Check if the routes's robot is already ON_ROUTE
            const is_on_route = await this.route_robot_on_route(route_id);
            if (is_on_route) continue;

            // Check if the order satisfies the weight and order_num requirements
            const wno = await this.get_route_weight_and_order_num(route_id);
            if (((wno.total_weight + weight) <= MAX_ROUTE_WEIGHT) 
                && (wno.order_num < MAX_ROUTE_ORDERS)) {
                await this.add_order_to_route(route_id, order_id);
                // TODO check here if the order is ready to be sent
                return;
            }
        }
        // If route was not found create a new one
        await this.create_route(order_id); 
    }

    // For the sake of placing them on the map
    static async get_unfinished_orders() {
      let q = await db.query(`SELECT * FROM Orders WHERE status < ${OrderStatus.DELIVERED}`);
      for (let i = 0; i < q.length; i++) {
        q[i].latitude = parseFloat(q[i].latitude);
        q[i].longitude = parseFloat(q[i].longitude);
      }
      return q; 
    }
    
    /**
     * 
     * @param {*} order_id 
     * @returns Order info and items. Also returns the eta if order is ON_ROUTE
     */
    static async get_order_info(order_id) {
        let orderInfo = (await db.query("SELECT order_id, user_id, cost, weight AS total_weight, address, delivery_fee, status, created_at, time_delivered FROM Orders WHERE order_id = ?", [order_id]))[0];
        if (orderInfo === undefined) {
            return { errMsg: `Order with order_id '${order_id}' does not exist`, orderInfo: null };
        }
        let order_eta = (await db.query(`SELECT eta FROM Route_to_orders WHERE order_id = ?`, [order_id]))[0];
        if (order_eta !== undefined) orderInfo["eta"] = order_eta.eta; 
        let order_items = await db.query("SELECT oi.product_id, oi.quantity, p.name, p.image_url, p.price, p.weight FROM Order_items AS oi INNER JOIN Products AS p ON oi.product_id = p.product_id WHERE oi.order_id = ?", [order_id]);
        orderInfo["products"] = order_items;
        const subtotal = order_items.reduce((accumulator, currentVal) => {
            return accumulator + (currentVal.price * currentVal.quantity);
        }, 0);
        orderInfo["subtotal"] = subtotal;
        orderInfo["taxAmount"] = subtotal / 100;
        return { orderInfo, errMsg: null };
    }

    static async get_user_orders(user_id) {
        let all_user_orders = {};
        const order_statuses = ["Ongoing Orders", "Out For Delivery", "Order History"];
        for (let [statusNum, orderStatus] of order_statuses.entries()) { // equivalent of enumerate() in python
            // DONT FORGET TO ADD DELIVERY TIME
            let orders = await db.query("SELECT order_id, cost, created_at, status, time_delivered FROM Orders WHERE user_id = ? AND status = ?", [user_id, statusNum]);
            for (let order of orders) {
                let prod_imgs = await db.query("SELECT p.image_url FROM Products AS p INNER JOIN Order_items AS oi ON p.product_id = oi.product_id WHERE oi.order_id = ?", [order.order_id]);
                order["image_urls"] = prod_imgs.map(e => e.image_url);

                if (order["status"] === OrderStatus.ON_THE_WAY) {
                    let order_eta = (await db.query(`SELECT eta FROM Route_to_orders 
                                                WHERE order_id = ?`, [order.order_id]))[0];
                    order["eta"] = order_eta.eta;
                }
            }
            all_user_orders[orderStatus] = orders;
        }
        return all_user_orders;
    }

    ///////
    // ANALYTICS queries
    ///////

    // Gets the revenue from the past 7 days
    /**
    *
    * @returns A single object mapping weekdays to revenue
    */
    static async get_week_revenue() {
        let q = await db.query(`SELECT
            SUM(CASE WHEN strftime('%w', created_at) = '0' THEN (cost + delivery_fee) ELSE 0 END) AS Sunday,
            SUM(CASE WHEN strftime('%w', created_at) = '1' THEN (cost + delivery_fee) ELSE 0 END) AS Monday,
            SUM(CASE WHEN strftime('%w', created_at) = '2' THEN (cost + delivery_fee) ELSE 0 END) AS Tuesday,
            SUM(CASE WHEN strftime('%w', created_at) = '3' THEN (cost + delivery_fee) ELSE 0 END) AS Wednesday,
            SUM(CASE WHEN strftime('%w', created_at) = '4' THEN (cost + delivery_fee) ELSE 0 END) AS Thursday,
            SUM(CASE WHEN strftime('%w', created_at) = '5' THEN (cost + delivery_fee) ELSE 0 END) AS Friday,
            SUM(CASE WHEN strftime('%w', created_at) = '6' THEN (cost + delivery_fee) ELSE 0 END) AS Saturday
            FROM Orders
            WHERE created_at BETWEEN datetime('now' , '-8 days') AND datetime('now' , '-1 days')`);
        return q[0];
    }

    // Get the revenue from the past 12 months
    // TODO only grab from completed orders
    /**
    *
    * @returns A single object mapping month names to revenue
    */
    static async get_month_revenue() {
        let q = await db.query(`SELECT
            SUM(CASE WHEN strftime('%m', created_at) = '01' THEN (cost + delivery_fee) ELSE 0 END) AS January,
            SUM(CASE WHEN strftime('%m', created_at) = '02' THEN (cost + delivery_fee) ELSE 0 END) AS February,
            SUM(CASE WHEN strftime('%m', created_at) = '03' THEN (cost + delivery_fee) ELSE 0 END) AS March,
            SUM(CASE WHEN strftime('%m', created_at) = '04' THEN (cost + delivery_fee) ELSE 0 END) AS April,
            SUM(CASE WHEN strftime('%m', created_at) = '05' THEN (cost + delivery_fee) ELSE 0 END) AS May,
            SUM(CASE WHEN strftime('%m', created_at) = '06' THEN (cost + delivery_fee) ELSE 0 END) AS June,
            SUM(CASE WHEN strftime('%m', created_at) = '07' THEN (cost + delivery_fee) ELSE 0 END) AS July, 
            SUM(CASE WHEN strftime('%m', created_at) = '08' THEN (cost + delivery_fee) ELSE 0 END) AS August,
            SUM(CASE WHEN strftime('%m', created_at) = '09' THEN (cost + delivery_fee) ELSE 0 END) AS September, 
            SUM(CASE WHEN strftime('%m', created_at) = '10' THEN (cost + delivery_fee) ELSE 0 END) AS October,
            SUM(CASE WHEN strftime('%m', created_at) = '11' THEN (cost + delivery_fee) ELSE 0 END) AS November, 
            SUM(CASE WHEN strftime('%m', created_at) = '12' THEN (cost + delivery_fee) ELSE 0 END) AS December  
            FROM Orders
            WHERE created_at > datetime('now' , '-12 months')`);
        return q[0];
    }

    // Get the revenue by year starting from 2022
    // TODO only grab from completed orders
    /**
    *
    *
    * @returns an array of year => revenue
    */
    static async get_year_revenue() {
        let q = await db.query(`SELECT
            strftime('%Y', created_at) AS year,
            SUM(cost + delivery_fee) AS revenue
            FROM Orders
            GROUP BY year`);
        return q;
    }

    ///////
    // EMPLOYEES queries
    ///////
    static async get_employees() {
        let q = await db.query(`SELECT username, user_id, email
            FROM Users
            WHERE user_type = 1`);
        return q;
    }
    
    ///////
    // ROBOT queries
    ///////
    static store = { 
        lat: 37.33518596879412, 
        lng: -121.88107208071463
    };

    static async add_new_robot() {
        await db.query("INSERT INTO Robot(latitude, longitude) VALUES (?, ?)", [this.store.lat, this.store.lng]);
    }

    // Gets robot data from each robot
    static async get_all_robots() {
        let q = await db.query("SELECT * FROM Robot ORDER BY robot_id");
        for (let i = 0; i < q.length; i++) {
            q[i].latitude = parseFloat(q[i].latitude);
            q[i].longitude = parseFloat(q[i].longitude);
        }
        return q;
    }

    static async update_robot_location(robot_id, lat, lng) {
        await db.query('UPDATE Robot SET latitude = ?, longitude = ? WHERE robot_id = ?', 
            [lat, lng, robot_id]);
    }

    /**
     * @returns boolean value
     */
    static async has_route(robot_id) {
        let q = await db.query("SELECT route_id FROM Robot WHERE robot_id = ?", [robot_id]);
        return (q[0] !== undefined && q[0].route_id !== null);
    }

    /**
     * @returns The route object or undefined if no route
     */
    static async get_route(robot_id) {
        let q = await db.query("SELECT * FROM Delivery_routes WHERE robot_id = ?", [robot_id]);
        return q[0]; 
    }

    // Checks if the robot is ON_ROUTE
    static async is_on_route(robot_id) {
        let q = await db.query("SELECT status FROM Robot WHERE robot_id = ?", [robot_id]);
        return (q[0].status > RobotStatus.IDLE);
    }

    static async set_robot_on_route(robot_id) {
        await db.query(`UPDATE Robot SET status = ${RobotStatus.ON_ROUTE} WHERE robot_id = ?`, 
            [robot_id]);
    }

    /**
     * Gets the polylines of the robot's route
     * 
     * @returns The endcoded polylines or an empty array if the routes does not exist
     *          OR the route doesn't have have any
     */
    static async get_robot_route_polylines(robot_id) {

        let route = await this.get_route(robot_id) // get Robot's route

        // Gets polylines if robot has route
        let q = [];
        if (route !== undefined) {
            q = await db.query(`SELECT polyline 
                                    FROM Route_to_orders 
                                    WHERE route_id = ? ORDER BY leg`, [route.route_id]);
        }
        return q.map(({ polyline }) => polyline);
    }  

    /**
     * Checks if the has a route that that 
     */
    static async check_robot_ready(robot_id) {

        // Check if robot is already ON_ROUTE
        if ((await this.is_on_route(robot_id))) return false;

        // Get robot's route
        let route = await this.get_route(robot_id);
        if (route === undefined) return false;
        
        let wno = await this.get_route_weight_and_order_num(route.route_id);

        return ((wno.total_weight === 200) || (wno.order_num === 10)) ? true : false;
    }
        
    ///////
    // ROUTE queries
    ///////

    /**
     * @param {*} order_id The first order to be added to the route
     * @returns  The route_id of the newly created route
     */
    static async create_route(order_id) {
        // Add query to order
        await db.query("INSERT INTO Delivery_routes(created_at) SELECT created_at FROM Orders WHERE order_id = ?", [order_id]);

        // Get the ID of the route 
        let last_inserted_row = await db.query("SELECT last_insert_rowid() as route_id");
        const route_id = last_inserted_row[0].route_id;

        // Add order to the route
        await db.query("INSERT INTO Route_to_orders(route_id, order_id) VALUES(?, ?)", [route_id, order_id]);

        return route_id;
    }

    static async has_robot(route_id) {
        let q = await db.query("SELECT robot_id FROM Delivery_routes WHERE route_id = ?", [route_id]);
        return (q[0] !== undefined && q[0].robot_id !== null);
    }

    static async add_order_to_route(route_id, order_id) {
        await db.query("INSERT INTO Route_to_orders(route_id, order_id) VALUES(?, ?)", [route_id, order_id]);
    }

    static async get_all_routes() {
        let q = await db.query(`SELECT * FROM Delivery_routes ORDER BY created_at`);
        return q;
    }

    /**
     * @param {*} route_id 
     * @returns An array of addresses
     */
    static async get_route_addresses(route_id) {
        let q = await db.query(`SELECT o.address 
                                    FROM Route_to_orders AS rto
                                    INNER JOIN Orders AS o 
                                    ON rto.order_id = o.order_id
                                    WHERE rto.route_id = ?
                                            `, [route_id]);
        return q.map(({ address }) => address);
    }

    /**
     * Checks if the route's robot is ON_ROUTE
     * 
     * @returns false if the route is not associated with a robot or the robot isn't ON_ROUTE
     */
    static async route_robot_on_route(route_id) {
        let q = await db.query(`SELECT 
                                    r.status AS status FROM Robot AS r
                                    INNER JOIN Delivery_routes AS dr 
                                    ON r.robot_id = dr.robot_id
                                    WHERE r.route_id = ?`, [route_id]);
        if (q[0] === undefined) return false; // Not Associated with robot
        let status = q[0].status;
        return (status === RobotStatus.ON_ROUTE); 
    }

    /**
     * Gets the total weight and number of orders of a route
     * 
     * @returns  Route weight and number of orders
     */
    static async get_route_weight_and_order_num(route_id) {
        let q = await db.query(`SELECT 
                                round(SUM(o.weight), 2) AS total_weight, 
                                COUNT(o.order_id) AS order_num 
                                FROM Route_to_orders AS rto 
                                INNER JOIN Orders AS o 
                                ON rto.order_id = o.order_id 
                                WHERE rto.route_id = ?`, [route_id]);
        return q[0]; 
    }

    /**
     * Will not set the route of the robot if robot already has one
     * 
     * @returns  Whether or not the route_id was set
     */
    static async set_route_to_robot(route_id, robot_id) {
        let has_route = await this.has_route(robot_id);
        if (!(await this.has_route(robot_id))) {
            await db.query("UPDATE Robot SET route_id = ? WHERE robot_id = ?", [route_id, robot_id]);
            await db.query("UPDATE Delivery_routes SET robot_id = ? WHERE route_id = ?", [robot_id, route_id]);
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {*} route_id 
     * @returns The order data from the route
     */
    static async get_route_orders(route_id) {
                let q = await db.query(`SELECT 
                o.*
                FROM Route_to_orders AS rto 
                INNER JOIN Orders AS o 
                ON rto.order_id = o.order_id 
                WHERE rto.route_id = ? ORDER BY created_at`, [route_id]);
        for (let i = 0; i < q.length; i++) {
            q[i].latitude = parseFloat(q[i].latitude);
            q[i].longitude = parseFloat(q[i].longitude);
            }
        // TODO might want to round the weights to two decimal places somewhere
        return q; 
    }

    /**
     * Assumption: The route has an associated robot that is ON_ROUTE and the route has 
     *             orders. 
     * 
     * @returns The encoded polylines of the route, sorted by the legs
     */
    static async get_route_polylines(route_id) {
        let q = await db.query("SELECT polyline FROM Route_to_orders WHERE route_id = ? ORDER BY leg", [route_id]);
        return q; 
    }

    /**
     * Function to be called when a robot is sent ON_ROUTE. Sets the encoded polylines, 
     * eta, leg numbers, and durations of the routes. Also updates the value of the ORDER_STATUS to
     * ON_THE_WAY
     * 
     * Assumptions: 
     * 
     * - The robot is associated with a route
     * 
     * - The Orders not associated with more than one route
     * 
     * - Addresses are the same as the ones corresponding to the orders in the database
     * 
     * 
     * @param {*} addresses               The addresses in the same order that they were fed into the 
     *                                    routing API. 
     * @param {*} polylines               The routing API
     * @param {*} durations               The duration of each leg in seconds, order by the leg
     * @param {*} optimizedWaypointOrder  The optimized waypoint index returned by the routing API
     */
    static async populate_route_data(robot_id, addresses, polylines, durations, optimizedWaypointOrder) {

        // TODO throw and error if durations is not made of integer values

        // Take care of edge case
        if (optimizedWaypointOrder[0] === -1) optimizedWaypointOrder[0] = 0;

        // Set robot ON_ROUTE
        await db.query(`UPDATE Robot SET status = ${RobotStatus.ON_ROUTE} WHERE robot_id = ?`, 
            [robot_id]);

        // Get the robot's route
        let route_id = (await db.query(`SELECT route_id FROM Robot WHERE robot_id = ?`, 
            [robot_id]))[0].route_id;

        let total_duration = 0; // Tracks the total duration so far in the loop
        for (let i = 0; i < addresses.length; i++) {
            total_duration += durations[i];
            let leg_address = addresses[optimizedWaypointOrder[i]];

            // Get the order id's
            let order_id = (await db.query(`SELECT o.order_id FROM Route_to_orders AS rto 
                                            INNER JOIN Orders AS o 
                                            ON rto.order_id = o.order_id
                                            WHERE o.address = ? 
                                            AND rto.route_id = ? 
                                            AND rto.polyline IS NULL`, 
                                            [leg_address, route_id]))[0].order_id;;

            // Fill out the leg information
            await db.query(`UPDATE Route_to_orders
                            SET polyline = ?,
                                eta = datetime('now', '+${total_duration} seconds', 'localtime'),
                                leg = ?,
                                duration = ? 
                            WHERE order_id = ?`, 
                            [polylines[i], i, durations[i], order_id]);

            // Update the order status
            await db.query(`UPDATE Orders SET status = ${OrderStatus.ON_THE_WAY} 
                WHERE order_id = ?`, [order_id]);
        }

        // Add the final leg to the store
        const store_id = -1;
        await db.query(`INSERT INTO Route_to_orders(
                                                    route_id, 
                                                    order_id, 
                                                    polyline,
                                                    leg, 
                                                    duration) 
                                    VALUES(?, ?, ?, ?, ?)`, 
                                [
                                    route_id, 
                                    store_id, 
                                    polylines[polylines.length - 1], 
                                    polylines.length - 1,
                                    durations[durations.length - 1]
                                ]);
    }

    /**
     * Updates the delivery_time and status of the order and then deletes the route leg. 
     */
    static async finish_route_leg(route_id, leg) {
        // Update the delivery time of the order
        await db.query(`UPDATE 
                            Orders SET 
                                time_delivered = datetime('now', 'localtime'),
                                status = ?
                        WHERE order_id = 
                        (SELECT order_id FROM Route_to_orders WHERE route_id = ? AND leg = ?)`
                        ,[OrderStatus.DELIVERED, route_id, leg]);
        // Delete the leg
        await db.query(`DELETE FROM Route_to_orders WHERE route_id = ? AND leg = ?`, [route_id, leg]);
    }

    /**
     * Deletes route from both the Delivery_routes and Robot tables. 
     * 
     * Assumption: There are no reminants of this route in the Route_to_orders table
     */
    static async delete_route(route_id) {

        // Delete the route in the Delivery_routes table
        await db.query(`DELETE FROM Delivery_routes WHERE route_id = ?`, [route_id]);

        // Update the robot's status, remove the route from the robot, and set location to store
        await db.query(`UPDATE Robot 
                                    SET 
                                        status = ${RobotStatus.IDLE},
                                        route_id = NULL,
                                        latitude = ?,
                                        longitude = ?
                                    WHERE route_id = ?`, 
                                    [this.store.lat, this.store.lng, route_id]);
    }

    ///////
    // OTHER queries
    ///////

    /**
     * @returns The current time in SQLite format
     */
    static async get_current_time() {
        let time = await db.query("SELECT datetime('now', 'localtime') AS time");
        return time[0].time;
    }


}

// exporting the DB commands class
module.exports = { DB };
