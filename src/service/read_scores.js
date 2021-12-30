const reddit = require('../reddit/client');
const parseCommand = require('../util/parse_command');
const database = require('../data/client');
const snoowrap = require('../reddit/client');
const moment = require('moment');
module.exports = async ({
    id
}) => {
    const year = moment().format('YYYY');
    const wikiSettings = await database.wiki_settings.select();
    console.log("Selecting match results by id: ", id);
    let matchResults = await database.match_results.select.by.id({
        id
    });
    matchResults = matchResults.rows[0];
    console.log({
        matchResults
    });

    const scoreCard = {
        corinthians: matchResults.corinthians_score,
        oponente: matchResults.oponente_score,
        playerScore: matchResults.player_scores
    };
    if (matchResults.corinthians_score === matchResults.oponente_score) scoreCard.resultado = 'e';
    if (matchResults.corinthians_score > matchResults.oponente_score) scoreCard.resultado = 'v';
    if (matchResults.corinthians_score < matchResults.oponente_score) scoreCard.resultado = 'd';
    console.log({
        scoreCard
    });
    scoreCard.resultado = scoreCard.resultado.toLowerCase();
    const thread = await reddit.getSubmission(matchResults.thread_id).fetch();
    const usersScored = [];

    const parseAndScoreComment = async (Comment) => {
        const comment = JSON.parse(JSON.stringify(Comment));
        const command = parseCommand(comment.body);

        // Command malformatted
        if (!command) return Comment.reply('Command malformatted').catch();

        // User already predicted
        let hasAlreadyPredicted = false;
        console.log({
            usersScored
        });
        console.log("Does usersScored include ", comment.author);
        if (usersScored.includes(comment.author)) hasAlreadyPredicted = true;
        console.log(hasAlreadyPredicted);
        if (hasAlreadyPredicted) return Comment.reply("You may only submit one prediction per match!").catch();

        // Score prediction
        usersScored.push(comment.author);
        let userScore = 0;
        let perfectScore = true;

        let resultado = command.args.get('resultado');
        resultado = resultado.toLowerCase();
        let corinthians = parseInt(command.args.get('corinthians'));
        let oponente = parseInt(command.args.get('oponente'));
        let playerScores = Array.from(command.args).filter(arg => arg[0] != 'resultado' && arg[0] != 'corinthians' && arg[0] != 'oponente');

        console.log({
            resultado,
            corinthians,
            oponente,
            playerScores
        });


        // Score win / loss / tie (resultado)
        if (resultado && resultado === scoreCard.resultado) {
            userScore += 100
        } else if (resultado && resultado != scoreCard.resultado) {
            userScore -= 10;
            perfectScore = false;
        }

        // Score player scores
        for (const playerScore of playerScores) {
            const playerName = playerScore[0].toLowerCase();
            const score = parseInt(playerScore[1]);
            const matchResult = matchResults.player_scores.find(player => player.name.toLowerCase() === playerName);
            if (!matchResult || matchResult.score != score) {
                userScore -= 10;
                perfectScore = false;
            } else {
                userScore += 75;
            }
        }

        // Score oponente goal amount
        if (oponente === scoreCard.oponente) {
            userScore += 50;
        } else {
            perfectScore = false;
        }

        // Score corinthians goal amount
        if (corinthians === scoreCard.corinthians) {
            userScore += 50;
        } else {
            perfectScore = false;
        }

        if (perfectScore) userScore += 50;

        console.log(`${comment.author} total score = `, userScore);
        let text = `You scored ${userScore} points.`;
        if (perfectScore) text = text.concat(` - You had a perfect prediction!`);
        text = text.concat(` Check out https://reddit.com/r/${process.env.SUBREDDIT_NAME}/wiki/${wikiSettings.rows[0].page_name}`);
        await snoowrap.composeMessage({
            subject: `${matchResults.match_title}`,
            text,
            to: comment.author
        }).catch(async (err) => {
            console.log("Error composing message: ", err.message);
            console.log("Replying to comment...");
            await Comment.reply(text).catch(err => {
                console.log("Error replying to comment: ", err);
            });
        });

        await database.user_score.insert({
            username: comment.author,
            score: userScore,
            year
        });
    }

    for (const Comment of thread.comments) {
        await parseAndScoreComment(Comment);
    };
    await database.match_results.update.results_processed({
        id
    });
}