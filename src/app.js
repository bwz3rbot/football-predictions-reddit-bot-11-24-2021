require('dotenv').config();
const readScoresService = require('./service/read_scores');
const defineScores = require('./service/define_scores');
const database = require('./data/client');
const wikiEdit = require('./service/edit_wiki');

(async () => {
    await database.init();
    const wikiPageSettings = await database.wiki_settings.select();
    if (!wikiPageSettings.rows.length) await database.wiki_settings.insert({
        title_text: 'Wiki Title Text'
    });
    const match_date = new Date();
    await defineScores({
        match_date,
        match_title: "Corinthians VS Oponente 11/24/2021",
        thread_id: "r14g0w",
        corinthians_score: 1,
        oponente_score: 2,
        player_scores: [{
                name: "james",
                score: 12,
            },
            {
                name: "mark",
                score: 1
            }, {
                name: "todd",
                score: 5
            }
        ]
    });

    await readScoresService({
        match_date,
        threadId: "r14g0w"
    });

    await wikiEdit(match_date);
})();