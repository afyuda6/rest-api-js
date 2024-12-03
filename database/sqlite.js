const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../rest_api_js.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('SQL error (connect database): ', err);
    } else {
        initializeDatabase();
    }
});

const initializeDatabase = () => {
    db.run(`DROP TABLE IF EXISTS users`, (err) => {});

    db.run(`CREATE TABLE IF NOT EXISTS users (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 name TEXT NOT NULL
            )`, (err) => {});
};

module.exports = db;
