#!/opt/bridleos/common/node-x86
require('readline').emitKeypressEvents(process.stdin);

process.stdin.on('keypress', function (ch, key) {
    console.log(key);

    if (key && key.ctrl && key.name === 'c') {
        process.stdin.pause();
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();