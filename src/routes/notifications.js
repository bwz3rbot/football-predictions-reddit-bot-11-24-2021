const express = require('express');

const router = express.Router();
const notificationService = require('../service/notification');
const blacklistService = require('../service/blacklist');
/* GET send notification page */
router.get('/', async (req, res, next) => {
    res.render('notifications', {
        title: 'Send a notification to all users of this application'
    });
});

/* POST submit form */
router.post('/form/submit', async (req, res, next) => {
    console.log("Running notification service: ",{
        subject: req.body.subject,
        body: req.body.body
    });

    notificationService.notify({
        subject: req.body.subject,
        body: req.body.body
    });
    res.send(201);
});

/* GET notification send status */
router.get('/status', async (req, res, next) => {

    const status = notificationService.getStatus();
    res.json(status);
});


/* GET Blacklist page */
router.get('/blacklist', async (req, res, next) => {

    res.render('notifications-blacklist', {
        title: 'Notification Blacklist'
    });

});

/* GET Blacklist user list */
router.get('/blacklist/users', async (req, res, next) => {
    const users = await blacklistService.getUsers();
    console.log("Returning json");
    console.log(users);
    return res.json(users);
})

/* POST Blacklist add user */
router.post('/blacklist/add', async (req, res, next) => {
    await blacklistService.addUser({
        username: req.body.username
    });
    return res.send(200);

});

/* POST Blacklist delete user */
router.post('/blacklist/delete', async (req, res, next) => {
    await blacklistService.deleteUser({
        username: req.body.username
    });
    return res.send(200);

});

module.exports = router;