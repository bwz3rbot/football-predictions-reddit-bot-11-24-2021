const database = require('../data/client');
const SnooMD = require('snoomd');
const snoomd = new SnooMD();
const snoowrap = require('../reddit/client');
const moment = require('moment');


module.exports = async ({
    match_date
}) => {
    const year = moment(match_date).format('YYYY');
    const wikiPageSettings = await database.wiki_settings.select();

    const headers = [" ", "User", "Score"];
    const tableRows = [];
    const userScores = await database.user_score.select.all.by.year(year);
    console.log("paginating through the predictions...");
    for (let i = 0; i < userScores.rows.length; i++) { // Paginate through the predictions database.
        // For each prediction, generate a table
        tableRows.push({
            position: `${i + 1})`,
            user: `u/${userScores.rows[i].username}`,
            score: userScores.rows[i].score
        });
    }
    const usersTable = snoomd.table(headers, tableRows);

    console.log(`http://reddit.com/r/${process.env.SUBREDDIT_NAME}/wiki/${year}`);
    console.log("-- EDITING WIKI PAGE");
    await snoowrap.getSubreddit(process.env.SUBREDDIT_NAME).getWikiPage(year).edit({
        text: `__${wikiPageSettings.rows[0].title_text}__\n\n\n${usersTable}`
    });
    await database.match_results.update.wiki_page({
        wiki_page: `https://reddit.com/r/${process.env.SUBREDDIT_NAME}/wiki/${year}`,
        match_date
    });
}