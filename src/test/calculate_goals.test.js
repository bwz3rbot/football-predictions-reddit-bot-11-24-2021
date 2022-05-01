
const calculateGoals = ({
    guessedGoalsNum,
    actualGoalsNum
}) => {
    let userScore = 0;

    // If user guessed a player scored a goal who didnt - user loses 10 pts per goal guessed
    if (!actualGoalsNum) {
        const decrement = guessedGoalsNum * 10;
        console.log("User guessed a player who did not make a goal. Minus ", decrement, " points");
        userScore -= decrement;
        perfectScore = false;
        return;
    }

    // User gains 75 pts per goal guessed that the player did in fact score
    actualGoalsNum = parseInt(actualGoalsNum);

    console.log("User guessed a player who scored. Guess=", guessedGoalsNum, " - actual score: ", actualGoalsNum);
    for (let i = 1; i <= guessedGoalsNum; i++) {
        if (i <= actualGoalsNum) {
            console.log(`${i} < ${actualGoalsNum}. Incrementing userScore += 75`);
            userScore += 75;
        }
        if (i > actualGoalsNum) {
            console.log(`${i} > ${actualGoalsNum}. Decrementing userScore -= 10`);
            perfectScore = false;
            userScore -= 10;
        }
    }
    return userScore;

}


// Calculate scores:

// 1.

const calculate = (
    actualGoalsNum
) => {
    console.log(calculateGoals({
        guessedGoalsNum: 1,
        actualGoalsNum
    }));
    console.log(calculateGoals({
        guessedGoalsNum: 2,
        actualGoalsNum
    }));
    console.log(calculateGoals({
        guessedGoalsNum: 3,
        actualGoalsNum
    }));
}
const all = () => {
    calculate(1);
    calculate(2);
    calculate(3);
}

all();