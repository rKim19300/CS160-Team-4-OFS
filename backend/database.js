const sqlite3 = require("sqlite3").verbose();

// db connection object
const db = new sqlite3.Database("db.db", (err) => {
    if (err) {
        return console.error(`Error while connecting to database: ${err.message}`);
    }
    console.log("Successfully connected to database");
    setup_tables();
})

// create a .query() method that allows us to run commands using async/await syntax
db.query = function(sql, params) {
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
}

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
    `, (err) => {
        if (err) console.log(`Error while trying to setup the DB tables: ${err}`);
    });
}

class DB {
    ///////
    // AUTH queries
    ///////
    static async get_user_from_email(email) {
        let q = await db.query("SELECT user_id, email, username, user_type FROM Users WHERE email = ?", [email]);
        return q[0];
    }

    static async insert_new_user(email, username, hashedPw, user_type=0) {
        await db.query("INSERT INTO Users(email, username, password, user_type) VALUES (?, ?, ?, ?)", [email, username, hashedPw, user_type]);
    }

    static async get_stored_password(email) {
        let q = await db.query("SELECT password FROM Users WHERE email = ?", [email]);
        return q[0].password;
    }

    ///////
    // PRODUCTS queries
    ///////
    static async select_all_products() {
        let prods = await db.query("SELECT * FROM Products");
        return prods;
    }

    static async get_product_info(product_id) {
        let q = await db.query("SELECT * FROM Products WHERE product_id = ?", [product_id]);
        return q[0];
    }

    static async add_new_product(name, description, image_url, price, weight, quantity) {
        await db.query("INSERT INTO Products(name, description, image_url, price, weight, quantity) VALUES (?, ?, ?, ?, ?, ?)", [name, description, image_url, price, weight, quantity]);
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
        let q = await db.query("SELECT p.product_id, p.name, p.description, p.price, p.weight, ci.quantity FROM Cart_items as ci INNER JOIN Products as p ON ci.product_id = p.product_id WHERE ci.cart_id = ?", [cart_id]);
        return q;
    }

    static async modify_cart_item_quantity(cart_id, product_id, quantity) {
        await db.query("UPDATE Cart_Items SET quantity = ? WHERE cart_id = ? AND product_id = ?", [quantity, cart_id, product_id]);
    }

    ///////
    // ORDER queries
    ///////
    static async get_user_order_history(user_id) {
        // TODO: FINISH THIS
    }
}

// exporting the DB commands class
module.exports = { DB };
