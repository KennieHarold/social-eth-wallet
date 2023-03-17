import { decrypt, encrypt } from '../src/utils/crypto';
import chai from 'chai';

const expect = chai.expect;

describe('Crypto Test Suite', () => {
  it('should encrypt', done => {
    encrypt('hello world', 'password');
    done();
  });
  it('should decrypt', done => {
    const plainText = 'hello world';
    const password = 'password';
    const { encryptedMessage, salt, iv } = encrypt(plainText, password);
    expect(decrypt(encryptedMessage, password, salt, iv)).to.eq(plainText);
    done();
  });
});
