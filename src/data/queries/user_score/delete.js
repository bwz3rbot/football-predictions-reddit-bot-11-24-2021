module.exports = {
    all: async () => {
        return global.pool.query(`TRUNCATE user_score;`);
    },
    by: {
        username: async (username) => {
            return global.pool.query(
                `DELETE FROM user_score
                WHERE
                username = $1;`,
                [
                    username
                ]
            );
        }
    }
}