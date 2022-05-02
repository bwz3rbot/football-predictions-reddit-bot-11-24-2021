module.exports = async ({
    username,
    score
}) => {
    console.log("-----INSERT USER SCORE TABLE-----", {
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
        );`,
        [
            username,
            score
        ]
    );
}