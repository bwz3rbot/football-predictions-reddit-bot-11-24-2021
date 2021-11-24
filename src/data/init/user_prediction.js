/* Create table user_score */
module.exports = async()=>{
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS user_prediction(
            username TEXT UNIQUE NOT NULL,
            prediction TEXT,
            match_type TEXT
        );`
    );
}