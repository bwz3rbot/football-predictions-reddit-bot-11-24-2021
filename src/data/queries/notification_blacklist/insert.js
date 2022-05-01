module.exports = async ({
    username
}) => {
    return global.pool.query(
        `INSERT INTO notification_blacklist
        (
            username
        )
        VALUES
        (
            $1
        )
        ON CONFLICT(username)
        DO NOTHING;`,
        [
            username
        ]
    );
}