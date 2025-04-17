const chalk = require('../common/node_modules/chalk');
require('../common/terminal').hideCursor();
console.clear();
const fs = require('fs');
const net = require('net');
const uuid = require('crypto').randomUUID;
const screenID = process.argv[2];
const screenIndex = process.argv[3];

const socket = net.createConnection("/run/bridled.sock");

global.openAppName = "";
global.appProcess = null;
global.appOpen = false;

function getTTYDisplay() {
    let terminals = JSON.parse(fs.readFileSync("/tmp/terminals.json").toString());
    let id = Object.keys(terminals).indexOf(screenIndex);
    let terminalsUI = Object.values(terminals).filter(i => i.type === "rubbery");
    let uiID = terminalsUI.indexOf(Object.values(terminals)[id]);

    if (terminalsUI.length > 5) {
        return [
            (uiID + 1) + "/" + terminalsUI.length,
            ((uiID + 1) + "/" + terminalsUI.length).length
        ];
    } else {
        let s = "";

        for (let i = 0; i < terminalsUI.length; i++) {
            if (i === uiID) {
                s += chalk.cyan("██");
            } else {
                s += chalk.yellowBright("██");
            }
        }

        return [ s, terminalsUI.length * 2 ];
    }
}

function openApp(name, path) {
    console.clear();

    global.openAppName = name;
    global.appProcess = require('child_process').spawn("../common/node-x86", [path], {
        stdio: "inherit"
    });
    global.appOpen = true;

    let terminals = JSON.parse(fs.readFileSync("/tmp/terminals.json").toString());
    terminals[screenIndex]["name"] = name;
    terminals[screenIndex]["free"] = false;

    let nextTTY = Math.max(...Object.keys(terminals).map(i => parseInt(i))) + 1;
    let id = uuid();

    terminals[nextTTY] = {
        id,
        type: "rubbery",
        name: "BridleOS user interface",
        free: true
    };

    socket.write(JSON.stringify({
        type: "create",
        id,
        index: nextTTY
    }));

    fs.writeFileSync("/tmp/terminals.json", JSON.stringify(terminals));

    updateBottom();
}

require('readline').emitKeypressEvents(process.stdin);

process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name === 'c') {
        if (global.appProcess) global.appProcess.kill("SIGKILL");
        console.clear();
        require('../common/terminal').showCursor();
        process.exit();
    } else if (key && key.meta && key.name === "space") {
        if (appOpen) return;
        openApp("Test BridleOS Application", "../apps/test.js");
    } else if (key && key.meta && key.name === "tab") {
        updateBottom();

        let tty = screenIndex;
        let terminals = JSON.parse(fs.readFileSync("/tmp/terminals.json").toString());
        let switched = false;
        let canSwitch = Object.values(terminals).filter(i => i.type === "rubbery").length > 1;
        if (!canSwitch) return;

        let i = parseInt(tty) + 1;

        while (terminals[i.toString()]) {
            if (terminals[i.toString()]["type"] === "rubbery" && terminals[i.toString()]["id"] !== screenID) {
                switched = true;
                socket.write(JSON.stringify({
                    type: "switch",
                    id: terminals[i.toString()]["id"]
                }));
                break;
            }
        }

        if (!switched) {
            for (let i = 1; i <= parseInt(Object.keys(terminals)[Object.keys(terminals).length - 1]); i++) {
                if (terminals[i.toString()]["type"] === "rubbery" && terminals[i.toString()]["id"] !== screenID) {
                    socket.write(JSON.stringify({
                        type: "switch",
                        id: terminals[i.toString()]["id"]
                    }));
                    break;
                }
            }
        }
    } else if (key && key.meta && key.name === "q") {
        if (!global.appOpen) return;
        if (global.appProcess) global.appProcess.kill("SIGKILL");
        console.clear();
        require('../common/terminal').showCursor();

        let terminals = JSON.parse(fs.readFileSync("/tmp/terminals.json").toString());
        terminals[screenIndex]["name"] = "Unused terminal";
        terminals[screenIndex]["free"] = false;
        terminals[screenIndex]["type"] = "unused";

        let nextTTY = Math.max(...Object.keys(terminals).filter(i => terminals[i]["type"] === "rubbery").map(i => parseInt(i)));
        socket.write(JSON.stringify({
            type: "switch",
            id: terminals[nextTTY.toString()]["id"]
        }));
        fs.writeFileSync("/tmp/terminals.json", JSON.stringify(terminals));

        process.exit(114);
    } else if (key && key.meta && key.name === "escape") {
        if (global.appProcess) global.appProcess.kill("SIGKILL");
        console.clear();
        require('../common/terminal').showCursor();
        require('child_process').execSync("sync");
        require('child_process').execSync("echo 'o' > /proc/sysrq-trigger");
    } else if (key && key.meta && key.name === "r") {
        if (global.appProcess) global.appProcess.kill("SIGKILL");
        console.clear();
        require('../common/terminal').showCursor();
        require('child_process').execSync("sync");
        require('child_process').execSync("echo 'b' > /proc/sysrq-trigger");
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdout.write("\u001b]P0111111"); // Black
process.stdout.write("\u001b]P80C111A"); // Dark gray
process.stdout.write("\u001b]P1FF7477"); // Dark red
process.stdout.write("\u001b]P9FF7477"); // Red
process.stdout.write("\u001b]P27F393A"); // Dark green
process.stdout.write("\u001b]PA7F393A"); // Green
process.stdout.write("\u001b]P3D8C3D6"); // Brown
process.stdout.write("\u001b]PBFCE3F9"); // Yellow
process.stdout.write("\u001b]P43A008B"); // Dark blue
process.stdout.write("\u001b]PC3A008B"); // Blue
process.stdout.write("\u001b]P5CD01B2"); // Dark magenta
process.stdout.write("\u001b]PDCD01B2"); // Magenta
process.stdout.write("\u001b]P6BF85B8"); // Dark cyan
process.stdout.write("\u001b]PE888888"); // Cyan
process.stdout.write("\u001b]P7E5E5E5"); // Light gray
process.stdout.write("\u001b]PFFFFFFF"); // White

console.clear();

function fixed(n) {
    return "00".substring(0, 2 - n.toString().length) + n.toString();
}

function getDoW(d) {
    switch (d) {
        case 0:
            return "Sun";

        case 1:
            return "Mon";

        case 2:
            return "Tue";

        case 3:
            return "Wed";

        case 4:
            return "Thu";

        case 5:
            return "Fri";

        case 6:
            return "Sat";

        default:
            return "???";
    }
}

function time() {
    return getDoW(new Date().getDay()) + " " + fixed(new Date().getHours()) + ":" + fixed(new Date().getMinutes());
}

function updateBottom() {
    process.stdout.cursorTo(0, 24);
    process.stdout.write("       ");

    let str1 = "  " + chalk.blue("██") + chalk.magenta("██") + chalk.red("██") + chalk.dim(" │ ");
    let str1r = "  ██████ │ ";

    let tty = getTTYDisplay();
    let str2 = tty[0] + " │ " + time() + "  ";
    let str2r = " ".repeat(tty[1]) + " │ " + time() + "  ";

    if (fs.existsSync("/tmp/display.txt")) {
        str2 = chalk.dim(" │ ") + fs.readFileSync("/tmp/display.txt").toString().trim() + chalk.dim(" │ ") + str2;
        str2r = " │ " + fs.readFileSync("/tmp/display.txt").toString().trim() + " │ " + str2r;
    }

    let appName = global.openAppName;

    if (appName.length > process.stdout.columns - str1r.length - str2r.length) {
        appName = appName.substring(0, process.stdout.columns - str1r.length - str2r.length - 3) + "...";
    }

    str1 += appName;
    str1r += appName;

    process.stdout.cursorTo(0, process.stdout.rows - 1);
    process.stdout.write(chalk.bgYellowBright.black(str1 + " ".repeat(process.stdout.columns - str1r.length - str2r.length) + str2));
}

global.loadInterval = setInterval(() => {
    if (process.stdout.columns < 100 || process.stdout.rows < 30) {
        return;
    }

    clearInterval(global.loadInterval);

    setInterval(() => {
        updateBottom();
    }, 3000);

    updateBottom();
    let offset = 0;

    for (let i = 0; i < 5; i++) {
        process.stdout.cursorTo(10, 0);
        process.stdout.write(chalk.red(" "));
        process.stdout.cursorTo(10, 1);
        process.stdout.write(chalk.red(" "));
        process.stdout.cursorTo(10, 2);
        process.stdout.write(chalk.red(" "));
        process.stdout.cursorTo(10, 3);
        process.stdout.write(chalk.red(" "));
        process.stdout.cursorTo(10, 4);
    }

    process.stdout.cursorTo(10, 5 + offset);
    process.stdout.write(chalk.green("────────────────────────────────────────────────────"));

    process.stdout.cursorTo(10, 7 + offset);
    process.stdout.write(chalk.red("Welcome to BridleOS! [Version " + fs.readFileSync("../common/version").toString().trim() + "]"));

    process.stdout.cursorTo(11, 9 + offset);
    process.stdout.write(chalk.red("* ") + chalk.magenta("◘") + " is the " + chalk.red("Bridle key") + ", also called Windows, Super or Command.");

    process.stdout.cursorTo(11, 10 + offset);
    process.stdout.write(chalk.red("  ") + "On a Bridle keyboard, it is represented by a butterfly icon.");

    process.stdout.cursorTo(11, 12 + offset);
    process.stdout.write(chalk.red("* ") + "Press " + chalk.magenta("◘") + "+Space to start a new application.");

    process.stdout.cursorTo(11, 13 + offset);
    process.stdout.write(chalk.red("  ") + "Press " + chalk.magenta("◘") + "+Q to force stop the currently open application.");

    process.stdout.cursorTo(11, 14 + offset);
    process.stdout.write(chalk.red("  ") + "Press " + chalk.magenta("◘") + "+Tab to switch to the next application.");

    process.stdout.cursorTo(11, 16 + offset);
    process.stdout.write(chalk.red("* ") + "Press " + chalk.magenta("◘") + "+Esc to turn off the system.");

    process.stdout.cursorTo(11, 17 + offset);
    process.stdout.write(chalk.red("  ") + "Press " + chalk.magenta("◘") + "+R to restart the system.");

    process.stdout.cursorTo(11, 19 + offset);
    process.stdout.write(chalk.red("* ") + "If the system stops responding, hold down Ctrl+Alt+Del to force a restart.");

    process.stdout.cursorTo(10, 21 + offset);
    process.stdout.write(chalk.green("────────────────────────────────────────────────────"));

    process.stdout.cursorTo(10, 23 + offset);
    process.stdout.write(chalk.red("Running applications"));

    process.stdout.cursorTo(10, 25 + offset);
    process.stdout.write(chalk.cyanBright("There are no open applications at the time."));

    process.stdout.cursorTo(10, 27 + offset);
    process.stdout.write(chalk.green("────────────────────────────────────────────────────"));

    for (let i = 0; i < process.stdout.rows; i++) {
        process.stdout.cursorTo(0, 0);
        process.stdout.write("       ");
    }
});