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
        )
        ON CONFLICT(match_date)
        DO UPDATE
        SET
        match_title = $2,
        thread_id = $3,
        oponente_score = $4,
        corinthians_score = $5,
        player_scores = $6;`,
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