const database = require('../data/client');
const SnooMD = require('snoomd');
const snoomd = new SnooMD();
const WikiEditor = require('../util/WikiEditor');
const snoowrap = require('../reddit/client');
const editor = new WikiEditor(snoowrap);
const moment = require('moment');


module.exports = async (matchDate) => {
    const formattedDate = moment(matchDate).format('MM-DD-YYYY');
    const wikiPageSettings = await database.wiki_settings.select();

    const headers = [" ", "User", "Score"];
    const tableRows = [];
    const userScores = await database.user_score.select.all();
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

    console.log(`http://reddit.com/r/${process.env.SUBREDDIT_NAME}/wiki/${formattedDate}`);
    return snoowrap.getSubreddit(process.env.SUBREDDIT_NAME).getWikiPage(formattedDate).edit({
        text: `__${wikiPageSettings.rows[0].title_text}__\n\n\n${usersTable}`
    });
}