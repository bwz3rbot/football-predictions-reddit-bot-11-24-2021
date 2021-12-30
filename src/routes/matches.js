const express = require('express');
const router = express.Router();
const database = require('../data/client');
const readScoresService = require('../service/read_scores');
const editWikiService = require('../service/edit_wiki');
const moment = require('moment');

/* GET Matches. */
router.get('/', async (req, res, next) => {
    const matches = await database.match_results.select.all();
    res.render('matches', {
        title: 'Matches',
        matches: matches.rows.map((row) => {
            return {
                ...row,
                formatted_date: moment(row.match_date).format('MM-DD-YYYY'),
                thread_link: `https://reddit.com/r/${process.env.SUBREDDIT_NAME}/comments/${row.thread_id}`
            }
        })
    });
});

/* POST Matches. */
router.post('/process', async (req, res, next) => {
    await readScoresService({
        id: req.body.id
    });
    res.send(200);
});

/* POST Update Wiki. */
router.post('/update_wiki', async (req, res, next) => {
    await editWikiService({
        id: req.body.id
    });
    res.send(200);
});

module.exports = router;