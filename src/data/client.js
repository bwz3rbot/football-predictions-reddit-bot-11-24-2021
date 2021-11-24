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

        this.match_results = {
            insert: require('./queries/match_results/insert'),
            select: require('./queries/match_results/select')
        }
    }

    async init() {
        await require('./init/match_results')();
    }
}

module.exports = new Database({
    database: process.env.DBNAME,
    host: process.env.PGHOST,
    password: process.env.PGPASS,
    port: process.env.PGPORT,
    user: process.env.PGUSER
});;