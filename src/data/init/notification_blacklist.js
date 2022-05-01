/* Create table notification_blacklist */
module.exports = async () => {
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS notification_blacklist(
            username TEXT NOT NULL PRIMARY KEY,
            timestamp TIMESTAMP NOT NULL DEFAULT NOW()
        );`
    );
}