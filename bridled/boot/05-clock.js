const cp = require('child_process');

try { cp.execSync("/opt/bridleos/bridled/boot/05-clock.sh", { stdio: "ignore" }); } catch (e) {}
log();