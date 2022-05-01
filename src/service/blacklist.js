const database = require('../data/client');

module.exports = {
    deleteUser: async ({
        username
    }) => {
        await database.notification_blacklist.delete({
            username
        });
        return true;
    },
    addUser: async ({
        username
    }) => {
        await database.notification_blacklist.insert({
            username
        });
        return true;
    },
    getUsers: async () => {
        const users = await database.notification_blacklist.select.all();
        return users.rows.map((row) => row.username);
    }
}