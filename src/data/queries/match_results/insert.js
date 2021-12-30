module.exports = async ({
    match_date,
    match_title,
    thread_id,
    oponente_score,
    corinthians_score,
    player_scores
}) => {
    return global.pool.query(
        `INSERT INTO match_results
        (
            match_date,
            match_title,
            thread_id,
            oponente_score,
            corinthians_score,
            player_scores
        )
        VALUES
        (
            $1,$2,$3,
            $4,$5,$6
        );`,
        [
            match_date,
            match_title,
            thread_id,
            oponente_score,
            corinthians_score,
            player_scores
        ]
    )

}