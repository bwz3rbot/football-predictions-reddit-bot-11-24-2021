/* Create table user_score */
module.exports = async () => {
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS user_score(
            username TEXT NOT NULL,
            year INTEGER NOT NULL,
            score INTEGER NOT NULL,
            PRIMARY KEY(username, year)
        );`
    );
}