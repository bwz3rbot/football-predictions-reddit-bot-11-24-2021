/* Create table user_score */
module.exports = async()=>{
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS user_score(
            username TEXT NOT NULL,
            nacionais INTEGER,
            internacionais INTEGER,
            annual INTEGER
        );`
    );
}