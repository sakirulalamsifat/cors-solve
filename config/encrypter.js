
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = 'b6970d88b2e6cb868199e8977f72f267'

const encryptString = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted.toString('hex')
 
};

const decryptString = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);

    return decrpyted.toString();
}


module.exports = { encryptString, decryptString }
