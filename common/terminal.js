module.exports = {
    hideCursor: () => {
        process.stdout.write("\u001b[?25l");
    },
    showCursor: () => {
        process.stdout.write("\u001b[?25h");
    }
}