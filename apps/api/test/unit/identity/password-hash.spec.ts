import { PasswordHash } from '@modules/identity/domain/value-objects/password-hash.js';

describe('PasswordHash', () => {
  it('creates a PasswordHash from a valid hash string', () => {
    const hash = PasswordHash.fromHash('$argon2id$v=19$m=65536,t=3,p=4$...');
    expect(hash.value).toBe('$argon2id$v=19$m=65536,t=3,p=4$...');
  });

  it('trims whitespace from the hash', () => {
    const hash = PasswordHash.fromHash('  somehash  ');
    expect(hash.value).toBe('somehash');
  });

  it('throws when hash is empty', () => {
    expect(() => PasswordHash.fromHash('')).toThrow('PasswordHash cannot be empty.');
  });

  it('throws when hash is whitespace only', () => {
    expect(() => PasswordHash.fromHash('   ')).toThrow('PasswordHash cannot be empty.');
  });

  it('two equal hashes are equal', () => {
    const a = PasswordHash.fromHash('hash123');
    const b = PasswordHash.fromHash('hash123');
    expect(a.equals(b)).toBe(true);
  });

  it('two different hashes are not equal', () => {
    const a = PasswordHash.fromHash('hash123');
    const b = PasswordHash.fromHash('hash456');
    expect(a.equals(b)).toBe(false);
  });
});
