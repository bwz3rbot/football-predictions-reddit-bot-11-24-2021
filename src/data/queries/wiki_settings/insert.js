module.exports = async ({
    title_text
}) => {
    return global.pool.query(
        `INSERT INTO wiki_settings
        (
            title_text, 
            id
        )
        VALUES
        (
            $1, 1
        )
        ON CONFLICT(id)
        DO UPDATE
        SET
        title_text = $1;`,
        [
            title_text
        ]
    )
}