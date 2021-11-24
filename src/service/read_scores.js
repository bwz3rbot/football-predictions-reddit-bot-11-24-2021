const reddit = require('../reddit/client');
const parseCommand = require('../util/parse_command');
const database = require('../data/client');
module.exports = async ({
    match_date,
    threadId
}) => {
    let matchResults = await database.match_results.select.by.match_date({
        match_date
    });
    matchResults = matchResults.rows[0];
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

        const scoreCard = {
            resultado: 0,
            corinthians: 0,
            oponente: 0,
            player: 0
        };

        if (resultado) {
            resultado = resultado.split('/');
            const corinthians = resultado[0];
            const 

        }

    }
}