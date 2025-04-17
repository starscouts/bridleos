const cp = require('child_process');

daemons.push(cp.exec("/usr/sbin/sshd -D"));
log();