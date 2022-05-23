const database = require('../data/client');
const snoowrap = require('../reddit/client');
const sleep = require('../util/sleep');
const parseRateLimit = require('../util/parse_rate_limit_error');
const status = {
    busy: false,
    messages: {
        sent: 0,
        queued: 0,
        errors: 0,
        total: 0
    }
};
module.exports = {
    notify: async ({
        subject,
        body
    }) => {
        // reset status
        status.busy = true;
        status.messages.sent = 0;
        status.messages.queued = 0;
        status.messages.errors = 0;
        status.messages.total = 0;

        // Select users
        let users = await database.user_score.select.users();
        users = users.rows.map(row => row.username);

        // Select blacklist
        let blacklist = await database.notification_blacklist.select.all();
        blacklist = blacklist.rows.map(row => row.username);


        // Filter users list against blacklist
        const filteredUserList = users.filter(user => !blacklist.includes(user));

        // Set status queue length
        status.messages.queued = filteredUserList.length;
        status.messages.total = filteredUserList.length;


        console.log("Sending messages to filteredUserList: ", filteredUserList);
        // Send message for each user in the queue
        for (let i = 0; i < filteredUserList.length; i++) {

            const doTrySendMessage = async () => {
                let numAttempts = 0;
                const recurse = async () => {
                    numAttempts++;
                    try {
                        console.log("Composing message: ", {
                            subject,
                            text: body,
                            to: filteredUserList[i]
                        });
                        await snoowrap.composeMessage({
                            subject,
                            text: body,
                            to: filteredUserList[i]
                        });
                        status.messages.sent++;

                    } catch (err) {
                        console.log("Error sending message: ");
                        console.log(err);
                        const parsed = parseRateLimit(err.message);
                        if (numAttempts < 3 && !isNaN(parsed)) {
                            console.log("Rate limit error. Sleeping ", parsed, "ms");
                            await sleep(parsed);
                            return doTrySendMessage();
                        } else {
                            status.messages.errors++;
                        }
                    }
                }

                return recurse();
            }

            await doTrySendMessage();
            status.messages.queued--;
            if (filteredUserList[i + 1]) await sleep(20 * 1000);

        }

        // Set busy to false, allowing process to run again
        status.busy = false;
    },
    getStatus: () => {
        console.log("Returning status: ", status);
        return status;
    }
}