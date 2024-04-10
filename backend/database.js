const sqlite3 = require("sqlite3").verbose();
const { UserType } = require("./enums/enums");

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
            latitude        TEXT NOT NULL,
            longitude       TEXT NOT NULL,
            status          INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Delivery_routes (
            route_id        INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            robot_id        INTEGER NOT NULL,
            order_id        INTEGER NOT NULL,
            FOREIGN KEY (robot_id) REFERENCES Robot(robot_id),
            FOREIGN KEY (order_id) REFERENCES Orders(order_id)
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

    static async insert_new_user(email, username, hashedPw, user_type=UserType.CUSTOMER) {
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
    }

    static async update_product_info(product_id, name, description, image_url, price, weight, quantity) {
        await db.query("UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, weight = ?, quantity = ? WHERE product_id = ?", [name, description, image_url, price, weight, quantity]);
    }
  
    static async subtract_product_inventory_quantity(product_id, quantity) {
        await db.query("UPDATE Products SET quantity = quantity - ? WHERE product_id = ?", [quantity, product_id]);
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
        if (category_ids.length < 1) return;
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

    static async add_new_order(user_id, cost, weight, address, delivery_fee, created_at, cart_id) {
        // inserts the order data into the `Orders` table and the `Order_items` table
        await db.query("INSERT INTO Orders(user_id, cost, weight, address, delivery_fee, created_at) VALUES (?, ?, ?, ?, ?, ?)", [user_id, cost, weight, address, delivery_fee, created_at]);
        // retrieve the last inserted order_id
        let lastInsertedOrder = await db.query("SELECT last_insert_rowid() as order_id");
        // extract the order_id
        let order_id = lastInsertedOrder[0].order_id;
        let cart_items = await db.query("SELECT product_id, quantity FROM Cart_items WHERE cart_id = ?", [cart_id]);
        for (let cart_item of cart_items) {
            let { product_id, quantity } = cart_item;
            await db.query("INSERT INTO Order_items(order_id, product_id, quantity) VALUES (?, ?, ?)", [order_id, product_id, quantity]);
        }
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
}

// exporting the DB commands class
module.exports = { DB };
