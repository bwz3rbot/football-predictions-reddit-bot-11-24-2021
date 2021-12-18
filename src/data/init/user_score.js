/* Create table user_score */
module.exports = async()=>{
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS user_score(
            username TEXT UNIQUE NOT NULL,
            score INTEGER
        );`
    );
}