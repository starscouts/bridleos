const cp = require('child_process');

try { cp.execSync("/opt/bridleos/bridled/boot/07-networking.sh", { stdio: "ignore" }); } catch (e) {}
log();