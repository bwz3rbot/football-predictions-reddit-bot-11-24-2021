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

        this.wiki_settings = {
            insert: require('./queries/wiki_settings/insert'),
            select: require('./queries/wiki_settings/select')
        }

        this.user_score = {
            insert: require('./queries/user_score/insert'),
            select: require('./queries/user_score/select'),
            delete: require('./queries/user_score/delete')
        }
    }

    async init() {
        await require('./init/user_score')();
        await require('./init/match_results')();
        await require('./init/wikisettings')();
    }
}

module.exports = new Database({
    database: process.env.DBNAME,
    host: process.env.PGHOST,
    password: process.env.PGPASS,
    port: process.env.PGPORT,
    user: process.env.PGUSER
});;