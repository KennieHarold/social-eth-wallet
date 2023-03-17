import crypto, { scryptSync, randomBytes } from 'crypto';

export const encrypt = (plainText: string, password: string) => {
  try {
    if (password.length < 8) {
      throw new Error(
        'Password should be greater than or equal to 8 characters',
      );
    }

    const salt = randomBytes(16);
    const iv = randomBytes(16);
    const key = scryptSync(password, salt, 32);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encryptedMessage =
      cipher.update(plainText, 'utf-8', 'hex') + cipher.final('hex');

    return {
      encryptedMessage,
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
    };
  } catch (error) {
    throw error;
  }
};

export const decrypt = (
  encryptedText: string,
  password: string,
  strSalt: string,
  strIv: string,
) => {
  try {
    const iv = Buffer.from(strIv, 'hex');
    const salt = Buffer.from(strSalt, 'hex');
    const key = scryptSync(password, salt, 32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decryptedMessage =
      decipher.update(encryptedText, 'hex', 'utf-8') + decipher.final('utf8');

    return decryptedMessage;
  } catch (error) {
    throw error;
  }
};
