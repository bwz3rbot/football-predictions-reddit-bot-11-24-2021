require("dotenv").config();
const snoowrap = require("./reddit/client");
const parseRateLimiteError = require("./util/parse_rate_limit_error");
(async () => {
	const comment = await snoowrap.getComment("josawe3").fetch();
	const res = await comment.reply("test");
	for (let i = 0; i < 10; i++) {
		const randomString =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		try {
			await comment.reply(randomString);
		} catch (err) {
			const waitTime = parseRateLimiteError(err.message);
			console.log({ waitTime });
		}
	}

	console.log(res);
})();
