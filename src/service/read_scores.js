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
    console.log({
        PlayerScores: matchResults.player_scores
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
        if (resultado) resultado = resultado.toLowerCase();
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
            console.log("resultado matches. +100 points");
            userScore += 100
        } else if (resultado && resultado != scoreCard.resultado) {
            console.log("resultado mismatch. -10 points");
            userScore -= 10;
            perfectScore = false;
        }

        // Score player scores
        for (const playerScore of playerScores) {
            const playerName = playerScore[0].toLowerCase();
            const score = parseInt(playerScore[1]);
            let matchResult = matchResults.player_scores.find(player => player.name.toLowerCase() === playerName);
            // If user guessed a player scored a goal who didnt - user loses 10 pts per goal guessed
            if (!matchResult) {
                const decrement = score * 10;
                console.log("User guessed a player who did not make a goal. Minus ", decrement, " points");
                userScore -= decrement;
                perfectScore = false;
            } else {
                // User gains 75 pts per goal guessed that the player did in fact score
                matchResult = parseInt(matchResult);
                console.log("User guessed a player who scored. Guess=", score, " - actual score: ", matchResult);
                for (let i = 0; i < matchResult; i++) {
                    console.log("Gain 75 pts!");
                    if (score <= matchResult) userScore += 75;
                }
                // If the user guessed an incorrect number of goals, lose 10 pts per goal over or under the actual total scored by the player
                if (score != matchResult) {
                    console.log("user guessed amount of goals incorrectly.");
                    const decrement = (Math.abs(score - matchResult) * 10);
                    userScore -= decrement;
                    perfectScore = false;
                }
            }
        }

        // Score corinthians goal amount
        if (!isNaN(corinthians) && corinthians === scoreCard.corinthians) {
            console.log("Corinthians score guessed correctly. +50 pts");
            userScore += 50;
        } else if (!isNaN(corinthians) && corinthians != scoreCard.corinthians) {
            console.log("Corinthians score guessed incorrectly. Lose 10 pts");
            userScore -= 10;
            perfectScore = false;
        }

        // Score oponente goal amount
        if (!isNaN(oponente) && oponente === scoreCard.oponente) {
            console.log("Oponente score guessed correctly. +50 pts");
            userScore += 50;
        } else if (!isNaN(oponente) && oponente != scoreCard.oponente) {
            console.log("Oponente score guessed incorrectly. lose 10 pts");
            userScore -= 10;
            perfectScore = false;
        }

        console.log("Perfect Score? ", perfectScore);
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