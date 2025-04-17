const cp = require('child_process');

let keymap = "/etc/keymap/fr-azerty.bmap.gz";

log();
cp.execSync('zcat "' + keymap + '" | loadkmap', { stdio: "ignore" });