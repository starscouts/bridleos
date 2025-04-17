const cp = require('child_process');

daemons.push(cp.exec("/sbin/acpid -f", () => {}, { stdio: "ignore" }));
log();