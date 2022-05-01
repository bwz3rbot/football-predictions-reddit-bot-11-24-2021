require('dotenv').config();

const database = require('../data/client');
(async () => {
    const username = 'bwz3r';
    const score = -1175;
    const user_score = await database.user_score.upsert({
        username,
        score
    });
    console.log(user_score.rows[0].score);
    // Reset total score to 0 if fall below
    if (user_score.rows[0].score < 0) {
        await database.user_score.update({
            username,
            score: 0
        });
    }
})();