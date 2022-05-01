module.exports = {
    all: async () => {
        return global.pool.query(
            `SELECT * FROM user_score
            ORDER BY score DESC;`,
        );
    },
    by: {
        username: async (username) => {
            return global.pool.query(
                `SELECT * FROM user_score
                WHERE
                username = $1;`,
                [
                    username
                ]
            )
        }
    },
    users: async () => {
        return global.pool.query(`SELECT DISTINCT username FROM user_score;`);
    }
}