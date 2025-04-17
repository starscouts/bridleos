const cp = require('child_process');

daemons.push(cp.exec("/usr/sbin/chronyd -f /etc/chrony/chrony.conf -n", () => {}, { stdio: "ignore" }));
log();