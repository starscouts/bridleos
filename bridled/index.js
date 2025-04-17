const chalk = require('../common/node_modules/chalk');
const si = require('../common/node_modules/systeminformation');
require('./logo');

require('child_process').exec("getty -n -i 0 -l /bin/ash /dev/tty2");
require('child_process').exec("getty -n -i 0 -l /opt/bridleos/debug.js /dev/tty3");

global.terminals = {
    1: {
        type: "linux",
        name: "Operating system kernel",
        free: false
    },
    2: {
        type: "ash",
        name: "Debugging console",
        free: false
    },
    3: {
        type: "debug",
        name: "Keyboard debugger",
        free: false
    },
    4: {
        type: "bridled",
        name: "BridleOS system",
        free: false
    }
}

let readline = require('readline');
const fs = require("fs");
readline.emitKeypressEvents(process.stdin);

global.daemons = [];
global.debug = false;

global.crash = (error, context) => {
    require('fs').writeFileSync("/var/log/error.txt", error.stack + (context.stack ? "\n\n" + context.stack : ""));
    if (!debug) return;

    require('child_process').execSync('echo 0 > /proc/sysrq-trigger');
    require('child_process').execSync('sysctl -w kernel.printk="0 0 0 0"');
    //console.clear();
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");

    console.log(error.stack);

    if (context) {
        console.log("");
        console.log(context.stack);
    }

    require('child_process').execSync('echo "s" > /proc/sysrq-trigger');
    require('child_process').execSync('echo "u" > /proc/sysrq-trigger');
    //require('child_process').execSync('echo "c" > /proc/sysrq-trigger');
}

process.stdin.on('keypress', function(ch, key) {
    if (key && key.ctrl && key.name === 'c') {
        require('../common/terminal').hideCursor();
        process.stdout.write("\u001b]P0FF0000");
        console.clear();
        require('child_process').execSync("chvt 1", { stdio: "inherit" });
        process.exit();
    } else if (key && key.ctrl && key.name === 'd') {
        crash(new Error("USER_INITIATED_CRASH"));
    }
});

process.on('uncaughtException', (e) => {
    crash(e);
});

process.stdin.setRawMode(true);
process.stdin.resume();

global.resetPalette = () => {
    process.stdout.write("\u001b]P0111111"); // Black
    process.stdout.write("\u001b]P80C111A"); // Dark gray
    process.stdout.write("\u001b]P1FF7477"); // Dark red
    process.stdout.write("\u001b]P9FF7477"); // Red
    process.stdout.write("\u001b]P287AF5F"); // Dark green
    process.stdout.write("\u001b]PA98E34D"); // Green
    process.stdout.write("\u001b]P387E0D8"); // Brown
    process.stdout.write("\u001b]PB87E0D8"); // Yellow
    process.stdout.write("\u001b]P43A008B"); // Dark blue
    process.stdout.write("\u001b]PC3A008B"); // Blue
    process.stdout.write("\u001b]P5CD01B2"); // Dark magenta
    process.stdout.write("\u001b]PDCD01B2"); // Magenta
    process.stdout.write("\u001b]P6222222"); // Dark cyan
    process.stdout.write("\u001b]PE222222"); // Cyan
    process.stdout.write("\u001b]P7E5E5E5"); // Light gray
    process.stdout.write("\u001b]PFFFFFFF"); // White
}

resetPalette();

let done = 0;

global.log = () => {
    done++;
    showBar(done / 19);
}

global.updateDisplay = async () => {
    let parts = [];

    let battery = await si.battery();
    if (battery.hasBattery) {
        parts.push("Battery: " + battery.percent + "%");
    }

    let temp = await si.cpuTemperature();
    let load = await si.currentLoad();
    if (temp.main && temp.main > 0) {
        parts.push("CPU: " + Math.round(load.currentLoad) + "% (" + temp.main + "°C)");
    } else {
        parts.push("CPU: " + Math.round(load.currentLoad) + "%");
    }

    let memory = await si.mem();
    parts.push("Memory: " + Math.round(memory.free / 1024**2) + "M free");

    let addresses = (await si.networkInterfaces()).filter(i => i.operstate === "up").map(i => i.ip4.trim() !== "" ? i.ip4 : i.ip6);

    if (addresses.length > 0) {
        if (addresses.length === 1) {
            parts.push("Network: " + addresses[0]);
        } else {
            parts.push("Network:  <" + addresses.length + " ifaces>");
        }
    }

    fs.writeFileSync("/tmp/display.txt", parts.join(", "));
}

require('../common/terminal').hideCursor();
console.clear();

process.stdout.cursorTo(0, 10);
logo(Math.round(process.stdout.columns / 2 - 25 / 2));

function showBar(percentage) {
    process.stdout.cursorTo(Math.round(process.stdout.columns / 2 - 28 / 2), process.stdout.rows - 10);

    let on = Math.round(28 * percentage);
    if (on > 28) on = 28;
    let off = 28 - on;

    process.stdout.write(chalk.bgCyan.magenta("█".repeat(on) + " ".repeat(off)));
}

showBar(0);

setTimeout(() => {
    try {
        for (let file of require('fs').readdirSync("./boot")) {
            if (!file.endsWith(".js")) continue;
            require('./boot/' + file);
        }
    } catch (e) {
        crash(new Error("PROCESS1_INITIALIZATION_FAILED"), e);
    }
}, 2000);