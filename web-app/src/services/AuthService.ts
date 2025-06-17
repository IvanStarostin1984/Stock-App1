import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

export interface UserCredential {
  email: string;
  hash: string;
  salt: string;
  isPro: boolean;
  created: string;
}

/**
 * S-05 – AuthService using AES-256 encrypted localStorage.
 */
export class AuthService {
  private key = CryptoJS.enc.Utf8.parse('0123456789abcdef0123456789abcdef');
  private iv = CryptoJS.enc.Utf8.parse('0123456789abcdef');
  private storeKey = 'user_cred';

  /** Register a new credential and persist it encrypted. */
  register(email: string, password: string): UserCredential {
    if (!email || !password) throw new Error('invalid input');
    const rawSalt = bcrypt.genSaltSync(12);
    const salt = rawSalt.replace('$2a$', '$2b$');
    const hash = bcrypt.hashSync(password, salt);
    const cred: UserCredential = {
      email,
      hash,
      salt,
      isPro: false,
      created: new Date().toISOString()
    };
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(cred),
      this.key,
      { iv: this.iv }
    ).toString();
    localStorage.setItem(this.storeKey, encrypted);
    return cred;
  }

  /** Check credentials against stored hash. */
  login(email: string, password: string): boolean {
    if (!email || !password) return false;
    const stored = localStorage.getItem(this.storeKey);
    if (!stored) return false;
    const decrypted = CryptoJS.AES.decrypt(stored, this.key, {
      iv: this.iv
    }).toString(CryptoJS.enc.Utf8);
    const cred = JSON.parse(decrypted) as UserCredential;
    if (cred.email !== email) return false;
    return bcrypt.compareSync(password, cred.hash);
  }

  /** Load stored credential if present. */
  load(): UserCredential | null {
    const stored = localStorage.getItem(this.storeKey);
    if (!stored) return null;
    const decrypted = CryptoJS.AES.decrypt(stored, this.key, {
      iv: this.iv
    }).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as UserCredential;
  }
}

