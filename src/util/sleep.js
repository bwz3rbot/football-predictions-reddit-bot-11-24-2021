module.exports = async (ms = 1000) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(ms);
    }, ms);
});