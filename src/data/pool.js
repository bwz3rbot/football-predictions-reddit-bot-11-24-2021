const {
    Pool
} = require('pg');
class Database {
    constructor({
        user,
        password,
        host,
        port,
        database
    }) {
        global.pool = new Pool({
            user,
            password,
            host,
            port,
            database
        });
    }

    async init() {
        await require('./init/user_score')();
    }
}

module.exports = Database;