const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// db connection object
const db = new sqlite3.Database("db.db", (err) => {
    if (err) {
        return console.error(`Error while connecting to database: ${err.message}`);
    }
    console.log("Successfully connected to database");
    init_db();
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

function init_db() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id         INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            email           VARCHAR(100) UNIQUE NOT NULL,
            username        VARCHAR(50) NOT NULL,
            password        VARCHAR(60) NOT NULL,
            user_type       INTEGER DEFAULT 0 NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Orders (
            order_id        PRIMARY KEY AUTOINCREMENT UNIQUE,
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
            FOREIGN KEY (product_id) REFERENCES Products(products_id)
        );

        CREATE TABLE IF NOT EXISTS Products (
            product_id      PRIMARY KEY AUTOINCREMENT UNIQUE,
            name            VARCHAR(50) NOT NULL,
            description     TEXT NOT NULL,
            price           REAL NOT NULL,
            weight          REAL NOT NULL,
            quantity        INTEGER NOT NULL,
        );

        CREATE TABLE IF NOT EXISTS Categories (
            category_id     PRIMARY KEY AUTOINCREMENT UNIQUE,
            name            VARCHAR(50) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Product_to_categories (
            product_id      INTEGER NOT NULL,
            category_id     INTEGER NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Products(product_id),
            FOREIGN KEY (category_id) REFERENCES Categories(Categories_id),
            UNIQUE (product_id, category_id)
        );


        CREATE TABLE IF NOT EXISTS Cart (
            cart_id         PRIMARY KEY AUTOINCREMENT UNIQUE,
            user_id         INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        );

        CREATE TABLE IF NOT EXISTS Cart_items (
            cart_id         INTEGER NOT NULL,
            product_id      INTEGER NOT NULL,
            quantity        INTEGER NOT NULL,
            FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
            FOREIGN KEY (product_id) REFERENCES Products(product_id)
        );

        CREATE TABLE IF NOT EXISTS Robot (
            robot_id        PRIMARY KEY AUTOINCREMENT UNIQUE,
            latitude        TEXT NOT NULL,
            longitude       TEXT NOT NULL,
            status          INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Delivery_routes (
            route_id        PRIMARY KEY AUTOINCREMENT UNIQUE,
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
    static async check_email_exists(email) {
        let q = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        return q.length > 0;
    }

    static async insert_new_user(email, username, password) {
        let salt = await bcrypt.genSalt();
        let hashedPw = await bcrypt.hash(password, salt);
        await db.query("INSERT INTO Users(email, username, password) VALUES (?, ?, ?)", [email, username, hashedPw]);
    }

    static async is_valid_password(email, password) {
        let q = await db.query("SELECT password FROM Users WHERE email = ?", [email]);
        let pw_in_db = q[0].password;
        let validPw = await bcrypt.compare(password, pw_in_db);
        return validPw
    }

    static async get_user_from_email(email) {
        let q = await db.query("SELECT user_id, email, username, is_employee FROM Users WHERE email = ?", [email]);
        return q[0];
    }

    ///////
    // PRODUCTS queries
    ///////
    static async select_all_products() {
        let prods = await db.query("SELECT * FROM Products");
        return prods;
    }
}

// exporting the DB commands class
module.exports = { DB };
