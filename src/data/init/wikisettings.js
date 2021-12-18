module.exports = async () => {
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS wiki_settings(
            title_text TEXT NOT NULL,
            id SERIAL UNIQUE NOT NULL
        );`
    );
}