module.exports = {
    results_processed: async ({
        match_date
    }) => {
        return global.pool.query(
            `UPDATE match_results
            SET
            results_processed = true
            WHERE
            match_date = $1;`,
            [
                match_date
            ]
        );
    },
    wiki_page: async ({
        wiki_page,
        match_date
    }) => {
        console.log({
            wiki_page,
            match_date
        });
        return global.pool.query(
            `UPDATE match_results
            SET
            wiki_page = $1
            WHERE
            match_date = $2;`,
            [
                wiki_page,
                match_date
            ]
        )
    }
}