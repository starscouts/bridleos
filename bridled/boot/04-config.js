const cp = require('child_process');
const fs = require('fs');

log();
if (!cp.execSync("df").includes("/tmp")) {
    cp.execSync("mount -n -t tmpfs -o noexec,nosuid,mode=0777 tmpfs /tmp", { stdio: "ignore" });
}

if (!cp.execSync("df").includes("/run")) {
    cp.execSync("mount -n -t tmpfs -o noexec,nosuid,mode=0777 tmpfs /run", { stdio: "ignore" });
}

if (!cp.execSync("df").includes("/dev/shm")) {
    cp.execSync("mount -n -t tmpfs -o noexec,nosuid,mode=0777 shm /dev/shm", { stdio: "ignore" });
}

log();
if (!fs.existsSync("/var/lib/misc")) fs.mkdirSync("/var/lib/misc");
if (!fs.existsSync("/run")) fs.mkdirSync("/run");
if (!fs.existsSync("/run/lock")) fs.mkdirSync("/run/lock");
if (!fs.existsSync("/var/run")) fs.linkSync("/run", "/var/run");
if (!fs.existsSync("/var/lock")) fs.linkSync("/run/lock", "/var/lock");
if (!fs.existsSync("/var/log")) fs.mkdirSync("/var/log");
if (!fs.existsSync("/tmp")) fs.mkdirSync("/tmp");

if (fs.existsSync("/var/log/dmesg.old")) fs.unlinkSync("/var/log/dmesg.old");
fs.renameSync("/var/log/dmesg", "/var/log/dmesg.old");
cp.execSync("dmesg > /var/log/dmesg", { stdio: "ignore" });
fs.chmodSync("/var/log/dmesg", 0o640);

log();
cp.execSync("swapon -a", { stdio: "ignore" });

log();
try { cp.execSync("/opt/bridleos/bridled/boot/04-config.sh", { stdio: "ignore" }); } catch (e) {}

let hostname = "localhost";
if (fs.existsSync("/etc/hostname")) hostname = fs.readFileSync("/etc/hostname").toString().trim();
cp.execFileSync("hostname", [hostname], { stdio: "ignore" });

daemons.push(cp.exec("/sbin/syslogd"));
log();