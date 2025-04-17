const net = require('net');
const fs = require('fs');
const cp = require('child_process');
const socketPath = '/run/bridled.sock';

fs.stat(socketPath, function(err) {
    if (!err) fs.unlinkSync(socketPath);

    const server = net.createServer((localSerialConnection) => {
        localSerialConnection.on('data', function(_data) {
            try {
                let data = JSON.parse(_data.toString());
                let terminals;

                switch (data.type) {
                    case "create":
                        try { cp.spawn("screen", ["-qdmS", data.id, "ash", "-c", "/opt/bridleos/rubbery/init " + data.id + " " + data.index], { stdio: "inherit" }); } catch (e) {}
                        break;

                    case "switch":
                        terminals = JSON.parse(fs.readFileSync("/tmp/terminals.json").toString());
                        for (let terminal of Object.values(terminals)) {
                            if (terminal["id"]) {
                                try { cp.spawn("screen", ["-qd", terminal["id"]], { stdio: "inherit" }); } catch (e) {}
                            }
                        }

                        try { cp.spawn("screen", ["-qr", data.id], { stdio: "inherit" }); } catch (e) {}
                        break;

                    default:
                        crash("INVALID_IPC_PAYLOAD", e);
                        break;
                }
            } catch (e) {
                crash("INVALID_IPC_PAYLOAD", e);
            }
        });
    });

    server.listen(socketPath);
});