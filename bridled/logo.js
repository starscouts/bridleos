const chalk = require('../common/node_modules/chalk');

global.logo = (padding) => {
    let lines = [
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.red.bgRed,
            chalk.black.bgRed,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack
        ],
        [
            chalk.black.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.black.bgBlue,
            chalk.black.bgBlue,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.red.bgBlack,
            chalk.black.bgRed,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
        ],
        [
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.red.bgRed,
            chalk.blue.bgRed,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.black.bgBlue,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.red.bgBlack,
            chalk.black.bgRed,
            chalk.black.bgBlack,
        ],
        [
            chalk.black.bgBlack,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.red.bgBlue,
            chalk.blue.bgBlue,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.black.bgBlue,
            chalk.black.bgRed,
            chalk.red.bgRed,
            chalk.red.bgRed,
        ],
        [
            chalk.black.bgBlack,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.red.bgBlue,
            chalk.red.bgRed,
            chalk.red.bgRed,
        ],
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.blue.bgBlue,
            chalk.red.bgRed,
            chalk.red.bgRed,
            chalk.red.bgRed,
        ],
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.blue.bgMagenta,
            chalk.blue.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.red.bgRed,
            chalk.red.bgRed,
            chalk.red.bgBlue,
        ],
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.red.bgRed,
            chalk.red.bgRed,
            chalk.red.bgBlue,
        ],
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.magenta.bgBlack,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgBlack,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.red.bgRed,
            chalk.red.bgRed,
        ],
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.magenta.bgMagenta,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.red.bgBlack,
        ],
        [
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.magenta.bgBlack,
            chalk.magenta.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
            chalk.black.bgBlack,
        ]
    ];

    for (let line of lines) {
        process.stdout.write(" ".repeat(padding ?? 0));

        for (let pixel of line) {
            process.stdout.write(pixel("▀"))
        }

        for (let pixel of line.slice(0, -1).reverse()) {
            process.stdout.write(pixel("▀"))
        }

        process.stdout.write("\n");
    }
}