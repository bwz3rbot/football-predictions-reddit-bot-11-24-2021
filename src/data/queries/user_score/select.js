module.exports = {
    all: async () => {
        return global.pool.query(
            `SELECT * FROM user_score
            ORDER BY score DESC;`
        );
    }
}