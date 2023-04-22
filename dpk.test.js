const { deterministicPartitionKey } = require('./dpk');
const crypto = require('crypto');

describe('deterministicPartitionKey', () => {
  it('should return the trivial partition key if no event is provided', () => {
    const result = deterministicPartitionKey();
    expect(result).toBe('0');
  });

  it('should return the event partition key if it exists', () => {
    const event = { partitionKey: 'test' };
    const result = deterministicPartitionKey(event);
    expect(result).toBe('test');
  });

  it('should return the hash of the event if no partition key is provided', () => {
    const event = { foo: 'bar' };
    const hash = crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex');
    const result = deterministicPartitionKey(event);
    expect(result).toBe(hash);
  });

  it('should stringify non-string partition keys', () => {
    const event = { partitionKey: 123 };
    const result = deterministicPartitionKey(event);
    expect(result).toBe('123');
  });

  it('should hash partition keys that exceed the maximum length', () => {
    const partitionKey = 'a'.repeat(257);
    const hash = crypto.createHash('sha3-512').update(partitionKey).digest('hex');
    const event = { partitionKey };
    const result = deterministicPartitionKey(event);
    expect(result).toBe(hash);
  });
});
