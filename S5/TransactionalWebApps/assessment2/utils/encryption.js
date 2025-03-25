"use strict";

const crypto = require("crypto");
const env = require("./../config/env");

const ENCRYPTION_KEY = env.encryption_key; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text, key = ENCRYPTION_KEY) {
  if (!key) {
    key = ENCRYPTION_KEY;
  }
  try {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (e) {
    throw e;
  }
}

function decrypt(text, key = ENCRYPTION_KEY) {
  if (!key) {
    key = ENCRYPTION_KEY;
  }
  try {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    throw e;
  }
}

module.exports = {
  decrypt,
  encrypt
};