import { sanitizePayload } from './sanitizePayload';

describe('sanitizePayload', () => {
  it('should redact sensitive fields', () => {
    const payload = {
      username: 'testuser',
      password: 'secret123',
      email: 'test@example.com',
      creditCardNumber: '1234-5678-9012-3456',
      address: '123 Test St',
    };

    const sanitized = sanitizePayload(payload);

    expect(sanitized).toEqual({
      username: 'testuser',
      password: '[REDACTED]',
      email: 'test@example.com',
      creditCardNumber: '[REDACTED]',
      address: '[REDACTED]',
    });
  });

  it('should handle empty payload', () => {
    const payload = {};
    const sanitized = sanitizePayload(payload);
    expect(sanitized).toEqual({});
  });

  it('should handle payload with no sensitive fields', () => {
    const payload = {
      username: 'testuser',
      email: 'test@example.com',
    };
    const sanitized = sanitizePayload(payload);
    expect(sanitized).toEqual(payload);
  });

  it('should use custom sensitive fields', () => {
    const payload = {
      username: 'testuser',
      customField: 'sensitive data',
    };
    const customSensitiveFields = ['customField'];
    const sanitized = sanitizePayload(payload, customSensitiveFields);
    expect(sanitized).toEqual({
      username: 'testuser',
      customField: '[REDACTED]',
    });
  });
});

