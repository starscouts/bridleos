const cp = require('child_process');

daemons.push(cp.exec("/usr/sbin/crond -f", () => {}, { stdio: "ignore" }));
log();