const express = require('express');
const router = express.Router();
const database = require('../data/client');

/* GET wiki settings. */
router.get('/', async (req, res, next) => {
    const wikiSettings = await database.wiki_settings.select();
    let currentTitle = '';
    if (wikiSettings.rows.length) currentTitle = wikiSettings.rows[0].title_text
    res.render('wiki', {
        title: 'Wiki Settings',
        currentTitle
    });
});

/* POST wiki title. */
router.post('/title', async (req, res, next) => {
    await database.wiki_settings.insert({
        title_text: req.body.titletext
    });
    res.redirect('/wiki');
});

module.exports = router;