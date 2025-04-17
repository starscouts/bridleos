const cp = require('child_process');

let keymap = "/etc/keymap/fr-azerty.bmap.gz";

log();
try { cp.execSync("/opt/bridleos/bridled/boot/03-modules.sh", { stdio: "ignore" }); } catch (e) {}