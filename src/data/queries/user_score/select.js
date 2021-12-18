module.exports = {
    all: {
        by: {
            year: async (year) => {
                return global.pool.query(
                    `SELECT * FROM user_score
                    WHERE
                    year = $1
                    ORDER BY score DESC;`,
                    [
                        year
                    ]
                );
            }
        }
    }
}