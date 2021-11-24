const Snoowrap = require('snoowrap');
const snoowrap = new Snoowrap({
    userAgent: process.env.RDT_AGENT,
    clientId: process.env.RDT_CLIENT_ID,
    clientSecret: process.env.RDT_CLIENT_SECRET,
    username: process.env.RDT_USERNAME,
    password: process.env.RDT_PASSWORD
});
snoowrap.config({
    continueAfterRatelimitError: true,
    retryErrorCodes: [502, 503, 504, 522],
    requestDelay: 1000,
    maxRetryAttempts: 3,
    debug: true
});
module.exports = snoowrap;