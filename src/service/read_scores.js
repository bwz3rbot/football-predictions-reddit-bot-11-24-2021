const reddit = require("../reddit/client");
const parseCommand = require("../util/parse_command");
const database = require("../data/client");
const snoowrap = require("../reddit/client");
const parseRateLimiteError = require("../util/parse_rate_limit_error");
const moment = require("moment");
const replySafe = async (comment, text) => {
	try {
		await comment.reply(text);
	} catch (err) {
		const waitTime = parseRateLimiteError(err.message);
		console.log(`Waiting ${waitTime}ms....`);
		await sleep(waitTime);
		return replySafe(comment);
	}
};
module.exports = async ({ id }) => {
	const year = moment().format("YYYY");
	const wikiSettings = await database.wiki_settings.select();
	console.log("Selecting match results by id: ", id);
	let matchResults = await database.match_results.select.by.id({
		id,
	});
	matchResults = matchResults.rows[0];
	console.log({
		matchResults,
	});
	console.log({
		PlayerScores: matchResults.player_scores,
	});

	const scoreCard = {
		corinthians: matchResults.corinthians_score,
		oponente: matchResults.oponente_score,
		playerScore: matchResults.player_scores,
	};
	if (matchResults.corinthians_score === matchResults.oponente_score)
		scoreCard.resultado = "e";
	if (matchResults.corinthians_score > matchResults.oponente_score)
		scoreCard.resultado = "v";
	if (matchResults.corinthians_score < matchResults.oponente_score)
		scoreCard.resultado = "d";
	console.log({
		scoreCard,
	});
	scoreCard.resultado = scoreCard.resultado.toLowerCase();
	const thread = await reddit.getSubmission(matchResults.thread_id).fetch();
	const usersScored = [];

	const parseAndScoreComment = async Comment => {
		const comment = JSON.parse(JSON.stringify(Comment));
		const command = parseCommand(comment.body);
		console.log(command);

		// Command malformatted
		if (!command) {
			return replySafe(comment, "Command malformatted");
		}

		// User already predicted
		let hasAlreadyPredicted = false;
		console.log({
			usersScored,
		});
		console.log("Does usersScored include ", comment.author);
		if (usersScored.includes(comment.author)) hasAlreadyPredicted = true;
		console.log(hasAlreadyPredicted);
		if (hasAlreadyPredicted) {
			return replySafe(
				comment,
				"You may only submit one prediction per match!"
			);
		}

		// Score prediction
		usersScored.push(comment.author);
		let userScore = 0;
		let perfectScore = true;

		let resultado = command.args.get("resultado");
		if (resultado) resultado = resultado.toLowerCase();
		let corinthians = parseInt(command.args.get("corinthians"));
		let oponente = parseInt(command.args.get("oponente"));
		let guessedPlayerGoals = Array.from(command.args).filter(
			arg =>
				arg[0] != "resultado" &&
				arg[0] != "corinthians" &&
				arg[0] != "oponente"
		);

		console.log({
			resultado,
			corinthians,
			oponente,
			playerScores: guessedPlayerGoals,
		});

		// Score win / loss / tie (resultado)
		if (resultado && resultado === scoreCard.resultado) {
			console.log("resultado matches. +100 points");
			userScore += 100;
		} else if (resultado && resultado != scoreCard.resultado) {
			console.log("resultado mismatch. -10 points");
			userScore -= 10;
			perfectScore = false;
		}

		// Score player scores
		for (const guessedPlayerGoal of guessedPlayerGoals) {
			const calculateGoals = () => {
				console.log(guessedPlayerGoal);
				const playerName = guessedPlayerGoal[0].toLowerCase();
				const guessedGoalsNum = parseInt(guessedPlayerGoal[1]);
				if (playerName === "" || isNaN(guessedGoalsNum)) return;

				let actualGoalsNum = matchResults.player_scores.find(
					player => player.name.toLowerCase() === playerName
				);
				// If user guessed a player scored a goal who didnt - user loses 10 pts per goal guessed
				if (!actualGoalsNum) {
					const decrement = guessedGoalsNum * 10;
					console.log(
						"User guessed a player who did not make a goal. Minus ",
						decrement,
						" points"
					);
					userScore -= decrement;
					perfectScore = false;
					return;
				}

				// User gains 75 pts per goal guessed that the player did in fact score
				actualGoalsNum = parseInt(actualGoalsNum.score);

				console.log(
					"User guessed a player who scored. Guess=",
					guessedGoalsNum,
					" - actual score: ",
					actualGoalsNum
				);
				for (let i = 1; i <= guessedGoalsNum; i++) {
					if (i <= actualGoalsNum) {
						console.log(
							`${i} < ${actualGoalsNum}. Incrementing userScore += 75`
						);
						userScore += 75;
					}
					if (i > actualGoalsNum) {
						console.log(
							`${i} > ${actualGoalsNum}. Decrementing userScore -= 10`
						);
						perfectScore = false;
						userScore -= 10;
					}
				}
			};

			calculateGoals();
		}

		// Score corinthians goal amount
		if (!isNaN(corinthians) && corinthians === scoreCard.corinthians) {
			console.log("Corinthians score guessed correctly. +50 pts");
			userScore += 50;
		} else if (
			!isNaN(corinthians) &&
			corinthians != scoreCard.corinthians
		) {
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
		// you scored x points. check out the wiki for more info
		let text = `Você fez ${userScore} pontos.`;
		if (perfectScore) {
			text = text.concat(` - Você fez uma aposta perfeita!`);
		}
		text = text.concat(
			` Veja a tabela de classificação [aqui](https://reddit.com/r/${process.env.SUBREDDIT_NAME}/wiki/${wikiSettings.rows[0].page_name}). A pontuação na tabela demora alguns minutos para atualizar.`
		);
		await replySafe(Comment, text);

		const user_score = await database.user_score.upsert({
			username: comment.author,
			score: userScore,
		});
		// Reset total score to 0 if fall below
		if (user_score.rows[0].score < 0)
			await database.user_score.update({
				username: comment.author,
				score: 0,
			});
	};

	for (const Comment of thread.comments) {
		console.log("------ HANDLING COMMENT ------");
		console.log(Comment.body);
		if (Comment.removed || Comment.body === "[deleted]") {
			console.log("Comment was removed or deleted. Skipping.");
		} else {
			await parseAndScoreComment(Comment).catch(async err => {
				console.log(err);
				await replySafe(
					Comment,
					"There was an error handling your command! Please check the formatting."
				);
			});
		}
	}
	await database.match_results.update.results_processed({
		id,
	});
};
