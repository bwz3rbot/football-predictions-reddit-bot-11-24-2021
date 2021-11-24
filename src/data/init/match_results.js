/* Create table user_score */
module.exports = async()=>{
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS match_results(
            match_date TIMESTAMP NOT NULL,
            match_title TEXT NOT NULL,
            thread_id TEXT NOT NULL,
            oponente_score INT NOT NULL,
            corinthians_score INT NOT NULL,
            player_scores JSONB NOT NULL
        );`
    );
}