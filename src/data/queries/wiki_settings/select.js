module.exports = async () => {
    return global.pool.query(
        `SELECT * FROM wiki_settings;`
    );
}