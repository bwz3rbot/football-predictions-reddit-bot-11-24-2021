module.exports = (err) => {
    console.log("parsing error");
    console.log("Error: ");
    console.log(err);

    if (!err.includes('RATELIMIT')) {
        console.log("Not a rate limit error. Returning false.");
        return false;
    }

    const splitError = err.split('Take a break for ')[1];
    const timeBeforeTryingAgain = splitError.split(' before trying again')[0]
    console.log({
        timeBeforeTryingAgain
    });
    const splitTime = timeBeforeTryingAgain.split(' ');

    const num = parseInt(splitTime[0]);
    const interval = splitTime[1];
    console.log({
        num,
        interval
    });

    let multiplier;
    switch (interval) {
        case ('seconds'): {
            multiplier = 1000;
            break;
        }
        case ('minutes'): {
            multiplier = 1000 * 60;
            break;
        }
    }
    console.log({
        num,
        multiplier,
        bonusSeconds: (1000 * 15)
    });
    return (num * multiplier) + (1000 * 15);
}