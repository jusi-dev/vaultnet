import crypto from 'crypto';

function createEncryptionKey() {
    return crypto.randomBytes(32).toString('base64');
}
  
// Function to create MD5 hash of the key
function createMD5Hash(key: any) {
  return crypto.createHash('md5').update(Buffer.from(key, 'base64')).digest('base64');
}

export async function generateEncryptionKey() {
    try {
        // User's encryption key
        const encryptionKeyBase64 = createEncryptionKey();
        const encryptionKeyMD5Base64 = createMD5Hash(encryptionKeyBase64);

        return { encryptionKeyBase64, encryptionKeyMD5Base64 }
    } catch (err) {
        throw new Error('Error generating encryption key');
    }
}