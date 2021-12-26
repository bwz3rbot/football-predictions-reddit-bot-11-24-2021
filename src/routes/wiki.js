const express = require('express');
const router = express.Router();
const database = require('../data/client');

const updateWikiService = require('../service/edit_wiki');

/* GET wiki settings. */
router.get('/', async (req, res, next) => {
    const wikiSettings = await database.wiki_settings.select();
    res.render('wiki', {
        title: 'Wiki Settings',
        currentTitle: wikiSettings.rows[0].title_text,
        wikiLink: `https://www.reddit.com/r/${process.env.SUBREDDIT_NAME}/wiki/${wikiSettings.rows[0].page_name}`
    });
});

/* POST update wiki title. */
router.post('/title', async (req, res, next) => {
    await database.wiki_settings.update.title_text({
        title_text: req.body.titletext
    });
    res.redirect('/wiki');
});

/* POST update page name. */
router.post('/page_name', async (req, res, next) => {
    await database.wiki_settings.update.page_name({
        page_name: req.body.pagename
    });
    res.redirect('/wiki');
});

/* POST update wiki. */
router.post('/update', async (req, res, next) => {
    await updateWikiService({
        match_date: null
    });
    res.send(200);
});

module.exports = router;