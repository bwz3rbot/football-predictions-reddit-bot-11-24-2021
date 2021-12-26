module.exports = async ({
    score,
    username
}) => {
    console.log("-----UPDATE USER SCORE TABLE-----", {
        score,
        username
    });
    return global.pool.query(
        `UPDATE user_score
        SET
        score = $1
        WHERE
        username = $2
        RETURNING *;`,
        [
            score,
            username
        ]
    );
}