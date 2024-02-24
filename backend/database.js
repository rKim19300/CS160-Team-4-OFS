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
            is_employee     INTEGER DEFAULT 0 NOT NULL
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
