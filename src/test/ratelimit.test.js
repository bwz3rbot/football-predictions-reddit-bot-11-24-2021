const error ="RATELIMIT,Looks like you've been doing that a lot. Take a break for 15 seconds before trying again.,ratelimit"
const parse = require('../util/parse_rate_limit_error');
const res = parse(error);
console.log(res);