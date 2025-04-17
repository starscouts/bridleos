const cp = require('child_process');
const fs = require('fs');

log();
try { cp.execSync("if [ -e /dev/fb0 ] && ! [ -e /sys/module/fbcon ]; then modprobe -b -q fbcon; fi", { stdio: "ignore" }); } catch (e) {}
log();

if (!fs.existsSync("/dev")) fs.mkdirSync("/dev");
try { cp.execSync("echo \"/sbin/mdev\" > /proc/sys/kernel/hotplug", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("for i in $(find /sys/devices -name 'usb[0-9]*'); do [ -e $i/uevent ] && echo add > $i/uevent; done", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("mdev -s", { stdio: "ignore" }); } catch (e) {}

log();
if (!cp.execSync("df").includes("devtmpfs ")) {
    cp.execSync("mount -n -t devtmpfs -o noexec,nosuid,mode=0755,size=10M dev /dev");
}

try { cp.execSync("[ -c /dev/console ] || mknod -m 600 /dev/console c 5 1", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -c /dev/tty1 ] || mknod -m 600 /dev/tty1 c 4 1", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -c /dev/tty ] || mknod -m 600 /dev/tty c 5 0", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -c /dev/null ] || mknod -m 666 /dev/null c 1 3", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -c /dev/kmsg ] || mknod -m 660 /dev/kmsg c 1 11", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -e /dev/fd ] || ln -snf /proc/self/fd /dev/fd", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -e /dev/stdin ] || ln -snf /proc/self/fd/0 /dev/stdin", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -e /dev/stdout ] || ln -snf /proc/self/fd/1 /dev/stdout", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -e /dev/stderr ] || ln -snf /proc/self/fd/2 /dev/stderr", { stdio: "ignore" }); } catch (e) {}
try { cp.execSync("[ -e /proc/kcore ] && ln -snf /proc/kcore /dev/core", { stdio: "ignore" }); } catch (e) {}

resetPalette();

log();
cp.execSync("mount -o remount,rw /");