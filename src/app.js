require('dotenv').config();
const readScoresService = require('./service/read_scores');
const defineScores = require('./service/define_scores');
const database = require('./data/client');

(async () => {
    await database.init();
    const match_date = new Date();
    // await defineScores({
    //     match_date,
    //     match_title: "Corinthians VS Oponente 11/24/2021",
    //     thread_id: "r14g0w",
    //     corinthians_score: 1,
    //     oponente_score: 2,
    //     player_scores: {
    //         "james": 12,
    //         "mark": 1,
    //         "todd": 5
    //     }

    // });
    await readScoresService({
        match_date,
        threadId: "r14g0w"
    });
})();