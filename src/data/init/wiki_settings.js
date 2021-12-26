module.exports = async () => {
    return global.pool.query(
        `CREATE TABLE IF NOT EXISTS wiki_settings(
            title_text TEXT NOT NULL DEFAULT '',
            page_name TEXT NOT NULL DEFAULT 'leaderboard',
            id SERIAL UNIQUE NOT NULL
        );`
    );
}