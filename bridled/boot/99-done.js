const fs = require("fs");
const uuid = require('crypto').randomUUID;

console.clear();
require('../../common/terminal').showCursor();
let id = uuid();

terminals[5] = {
    id,
    type: "rubbery",
    name: "BridleOS user interface",
    free: true
};
fs.writeFileSync("/tmp/terminals.json", JSON.stringify(terminals));

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

try { require('child_process').spawn("screen", ["-qS", id, "ash", "-c", "/opt/bridleos/rubbery/init " + id + " 5"], { stdio: "inherit" }); } catch (e) {}

setInterval(() => {
    updateDisplay();
}, 3000);

require('../ipc');