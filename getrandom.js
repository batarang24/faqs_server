const crypto = require("crypto");

function generateRandomPassword(length = 10) {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
        .map((x) => chars[x % chars.length])
        .join("");
}
module.exports=generateRandomPassword;

