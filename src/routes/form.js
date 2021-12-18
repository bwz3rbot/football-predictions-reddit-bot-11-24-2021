const express = require('express');
const router = express.Router();
const defineScoresService = require('../service/define_scores');
const moment = require('moment');

/* POST submit form. */
router.get('/', async (req, res, next) => {
    res.render('form', {
        title: "Submit Form"
    });
});

/* POST submit form. */
router.post('/submit', async (req, res, next) => {

    const matchdate = new Date(req.body.matchdate);
    const formattedMatchDate = moment(matchdate).format('MM-DD-YYYY');
    const player_scores = [];
    for (const playerNameKey of Array.from(Object.keys(req.body).filter(key => key.includes('playername')))) {
        const playerName = req.body[playerNameKey];
        if (playerName && playerName != '') {
            player_scores.push({
                name: playerName,
                score: req.body[`playerscore-${playerNameKey.split('-')[1]}`]
            });
        }
    }

    await defineScoresService({
        corinthians_score: req.body.corinthians,
        oponente_score: req.body.oponente,
        match_date: new Date(req.body.matchdate),
        match_title: `Corinthians VS ${req.body.oponentename} - ${formattedMatchDate}`,
        thread_id: req.body.threadid,
        player_scores
    });

    res.redirect('/');
});

module.exports = router;