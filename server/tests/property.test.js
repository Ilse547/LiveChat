const fc = require('fast-check');

function extractUsername(email) {
  return email.split('@')[0];
}
function generateOTP(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num.toString();
}
describe('Property-based tests', () => {
  describe('Username extraction from email', () => {
    it('should never be empty for a valid email', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const username = extractUsername(email);
          return username.length > 0;
        })
      );
    });

    it('should never contain @', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const username = extractUsername(email);
          return !username.includes('@');
        })
      );
    });

    it('should always be the part before the @', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const username = extractUsername(email);
          return email.startsWith(username + '@');
        })
      );
    });
  });

  describe('OTP code generation', () => {
    const OTP_MIN = 100000;
    const OTP_MAX = 999999;
    it('should always be 6 digits', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: OTP_MIN, max: OTP_MAX }),
          (code) => {
            return code.toString().length === 6;
          }
        )
      );
    });

    it('should never be below 100000', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: OTP_MIN, max: OTP_MAX }),
          (code) => code >= OTP_MIN
        )
      );
    });

    it('should never exceed 999999', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: OTP_MIN, max: OTP_MAX }),
          (code) => code <= OTP_MAX
        )
      );
    });
  });
});
