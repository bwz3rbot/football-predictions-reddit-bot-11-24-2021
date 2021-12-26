module.exports = {
    title_text: async ({
        title_text
    }) => {
        return global.pool.query(
            `UPDATE wiki_settings
            SET
            title_text = $1
            WHERE
            id = 1;`,
            [
                title_text
            ]
        );
    },
    page_name: async ({
        page_name
    }) => {
        return global.pool.query(
            `UPDATE wiki_settings
            SET
            page_name = $1
            WHERE
            id = 1`,
            [
                page_name
            ]
        );
    }

}