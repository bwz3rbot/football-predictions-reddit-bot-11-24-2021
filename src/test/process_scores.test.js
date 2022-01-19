require('dotenv').config();
(async () => {
    const readScores = require('../service/read_scores');
    await readScores({
        id: 3
    });
})();