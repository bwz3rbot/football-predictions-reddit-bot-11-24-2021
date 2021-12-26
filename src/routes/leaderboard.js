const express = require('express');
const router = express.Router();
const database = require('../data/client');
/* GET home page. */
router.get('/', async (req, res, next) => {
    const scores = await database.user_score.select.all();
    let i = 0;
    res.render('leaderboard', {
        title: 'Leaderboard',
        leaderboard: scores.rows.map((row) => {
            return {
                position: ++i,
                ...row
            }
        })
    });

});

module.exports = router;