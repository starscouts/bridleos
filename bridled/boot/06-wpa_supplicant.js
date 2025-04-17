const cp = require('child_process');
const fs = require('fs');

if (!fs.existsSync("/var/run/wpa_supplicant")) {
    fs.mkdirSync("/var/run/wpa_supplicant", {
        mode: 0o755
    });
    fs.chownSync("/var/run/wpa_supplicant", 0, 0);
}

log();
try { cp.execSync("/opt/bridleos/bridled/boot/06-wpa_supplicant.sh", { stdio: "ignore" }); } catch (e) {}
log();