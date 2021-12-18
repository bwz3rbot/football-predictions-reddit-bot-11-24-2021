module.exports = async ({
    username,
    year,
    score
}) => {
    console.log("-----UPDATE USER SCORE TABLE-----", {
        username,
        year,
        score
    });
    return global.pool.query(
        `INSERT INTO user_score
        (
            username,
            year,
            score
        )
        VALUES
        (
            $1,$2,$3
        )
        ON CONFLICT(username, year)
        DO UPDATE
        SET
        score = user_score.score + $3;`,
        [
            username,
            year,
            score
        ]
    );
}