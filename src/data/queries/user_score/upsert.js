module.exports = async ({
    username,
    score
}) => {
    console.log("-----UPDATE USER SCORE TABLE-----", {
        username,
        score
    });
    return global.pool.query(
        `INSERT INTO user_score
        (
            username,
            score
        )
        VALUES
        (
            $1,$2
        )
        ON CONFLICT(username)
        DO UPDATE
        SET
        score = user_score.score + $2
        RETURNING *;`,
        [
            username,
            score
        ]
    );
}