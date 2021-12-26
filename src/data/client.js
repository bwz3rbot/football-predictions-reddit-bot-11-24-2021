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
        let options = {};
        if (process.env.DATABASE_URL) {
            options = {
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                }
            }
        } else {
            options = {
                user,
                password,
                host,
                port,
                database
            }
        }
        global.pool = new Pool(options);

        this.match_results = {
            insert: require('./queries/match_results/insert'),
            select: require('./queries/match_results/select'),
            update: require('./queries/match_results/update')
        }

        this.wiki_settings = {
            insert: require('./queries/wiki_settings/insert'),
            select: require('./queries/wiki_settings/select'),
            update: require('./queries/wiki_settings/update')
        }

        this.user_score = {
            insert: require('./queries/user_score/insert'),
            select: require('./queries/user_score/select'),
            delete: require('./queries/user_score/delete'),
            update: require('./queries/user_score/update')
        }
    }

    async init() {
        await require('./init/user_score')();
        await require('./init/match_results')();
        await require('./init/wiki_settings')();
    }
}

module.exports = new Database({
    database: process.env.DBNAME,
    host: process.env.PGHOST,
    password: process.env.PGPASS,
    port: process.env.PGPORT,
    user: process.env.PGUSER
});;