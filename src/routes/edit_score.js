const express = require('express');
const router = express.Router();
const database = require('../data/client');

/* GET Edit user's score form. */
router.get('/', async (req, res, next) => {
    res.render('edit_score', {
        title: "Edit A User's Score"
    });
});

/* POST Edit Score. */
router.post('/edit', async (req, res, next) => {
    const updatedScore = await database.user_score.update({
        score: req.body.score,
        username: req.body.username
    });
    let score;
    if (!updatedScore.rows.length) {
        await database.user_score.insert({
            username: req.body.username,
            score: req.body.score
        });
        score = req.body.score;
    } else {
        score = updatedScore.rows[0].score;
    }
    return res.json({
        score
    });
});

router.post('/view', async (req, res, next) => {
    console.log("Req.body:");
    console.log(req.body);
    const userScore = await database.user_score.select.by.username(req.body.username);
    console.log(userScore.rows);
    let score;
    if (!userScore.rows.length) {
        score = null;
    } else {
        score = userScore.rows[0].score;
    }

    return res.json({
        score
    });
});

router.post('/delete_user', async (req, res, next) => {
    await database.user_score.delete.by.username(req.body.username);
    res.send(204);
})

router.post('/truncate_table', async (req, res, next) => {
    await database.user_score.delete.all();
    res.send(204);
})

module.exports = router;