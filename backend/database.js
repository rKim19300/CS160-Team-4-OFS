const sqlite3 = require("sqlite3").verbose();

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
            username        VARCHAR(50) NOT NULL,
            password        VARCHAR(60) NOT NULL,
            phone_number    VARCHAR(20) NOT NULL,
            is_employee     INTEGER DEFAULT 0 NOT NULL
        );
    `, (err) => {
        if (err) console.log(`Error while trying to setup the DB tables: ${err}`);
    });
}

// exporting the db connection object
module.exports = { db };
