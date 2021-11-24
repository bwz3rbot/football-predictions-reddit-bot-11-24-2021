const reddit = require('../reddit/client');
const parseCommand = require('../util/parse_command');
module.exports = async ({
    threadId
}) => {
    const thread = await reddit.getSubmission(threadId).fetch();
    console.log(thread.comments);
    for (const comment of thread.comments) {
        console.log(comment.id);
        console.log(comment.body);
        const command = parseCommand(comment.body);
        if (!command) return reddit.getComment(comment.id).reply('Command malformatted');

        console.log({
            command
        });

        let resultado = command.args.get('resultado');
        let corinthians = command.args.get('corinthians');
        let oponente = command.args.get('oponente');
        let player = command.args.get('player');

        console.log({
            resultado,
            corinthians,
            opponente: oponente,
            player
        });

    }
}