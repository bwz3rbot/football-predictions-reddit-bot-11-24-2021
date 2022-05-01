module.exports = {
    all: async () => {
        return global.pool.query(
            `SELECT * FROM notification_blacklist
            ORDER BY
            timestamp DESC;`
        )
    }
}