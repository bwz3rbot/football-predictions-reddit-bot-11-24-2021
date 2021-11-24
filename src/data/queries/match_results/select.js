module.exports = {
    all: async () => {
        return global.pool.query(
            `SELECT * FROM match_results
            ORDER BY match_date DESC;`
        );
    },
    by: {
        match_date: async ({
            match_date
        }) => {
            return global.pool.query(
                `SELECT * FROM match_results
                WHERE
                match_date = $1;`,
                [
                    match_date
                ]
            )
        }
    }
}