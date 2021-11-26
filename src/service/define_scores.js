const database = require('../data/client');
module.exports = async ({
    corinthians_score,
    match_date,
    match_title,
    oponente_score,
    player_scores,
    thread_id
}) => {

    console.log({
        corinthians_score,
        match_date,
        match_title,
        oponente_score,
        player_scores,
        thread_id
    });

    await database.match_results.insert({
        corinthians_score,
        match_date,
        match_title,
        oponente_score,
        player_scores: JSON.stringify(player_scores),
        thread_id
    });
}