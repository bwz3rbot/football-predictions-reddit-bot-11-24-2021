module.exports = {
    results_processed: async ({
        id
    }) => {
        return global.pool.query(
            `UPDATE match_results
            SET
            results_processed = true
            WHERE
            id = $1;`,
            [
                id
            ]
        );
    },
    wiki_page: async ({
        wiki_page,
        id
    }) => {
        return global.pool.query(
            `UPDATE match_results
            SET
            wiki_page = $1
            WHERE
            id = $2;`,
            [
                wiki_page,
                id
            ]
        )
    }
}