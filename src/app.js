require('dotenv').config();
const readScoresService = require('./service/read_scores');
const defineScores = require('./service/define_scores');
(async () => {
    await defineScores({
        matchDate: new Date(),
        matchTitle: "Corinthians VS Oponente 11/24/2021",
        threadId: "r14g0w",
        corinthiansScore: 1,
        oponenteScore: 2,
        playerScores: {
            "james": 12,
            "mark": 1,
            "todd": 5
        }

    });
    await readScoresService({
        threadId: "r14g0w"
    });
})();