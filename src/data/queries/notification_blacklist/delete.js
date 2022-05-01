module.exports = async ({
    username
}) => {
    return global.pool.query(
        `DELETE FROM notification_blacklist
        WHERE
        username = $1;`,
        [
            username
        ]
    );
}