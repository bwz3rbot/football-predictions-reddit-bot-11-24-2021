/* Build Args */
const buildArgs =
    (args) => {
        const argArr = new Map();
        args.forEach((arg) => {
            if (arg.includes(":")) {
                const a = arg.split(':');
                argArr.set(a[0], a[1]);
            } else {
                argArr.set(arg, true);
            }
        });
        return argArr;
    }
const prefix = process.env.PREFIX || `!`;
module.exports =
    (message) => {
        message = message.trim();
        const pref = message.slice(0, prefix.length);
        if (pref != prefix) {
            return;
        }
        const command = message.split(/ /g);
        if (command.length === 1) { // If no args, return command
            return {
                directive: command[0].slice(prefix.length),
                args: new Map()
            }
        }

        const directive = command[0].slice(prefix.length);
        const a = command.slice(1, command.length);
        const args = buildArgs(a);
        return {
            directive,
            args
        }
    }
