module.exports = {
    all: async () => {
        return global.pool.query(
            `SELECT * FROM match_results
            ORDER BY match_date DESC;`
        );
    },
    by: {
        id: async ({
            id
        }) => {
            return global.pool.query(
                `SELECT * FROM match_results
                WHERE
                id = $1;`,
                [
                    id
                ]
            )
        }
    }
}