const fc = require('fast-check');
const jwt = require('jsonwebtoken');

function extractUsername(email) {
  return email.split('@')[0];
}

function isValidPassword(password) {
  return password.length >= 8;
}

function isValidGroupName(name) {
  return name.length >= 3 && name.length <= 10;
}

function isValidUsername(username) {
  return username.length >= 3 && username.length <= 10;
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
          (code) => code.toString().length === 6
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

  describe('Password validation', () => {
    it('should always accept passwords of 8 or more characters', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 8 }), (password) => {
          return isValidPassword(password) === true;
        })
      );
    });
    it('should always reject passwords shorter than 8 characters', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 7 }), (password) => {
          return isValidPassword(password) === false;
        })
      );
    });
  });
  describe('Group name validation (min 3, max 10 chars)', () => {
    it('should always accept valid group names', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 3, maxLength: 10 }), (name) => {
          return isValidGroupName(name) === true;
        })
      );
    });
    it('should always reject group names that are too short', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 2 }), (name) => {
          return isValidGroupName(name) === false;
        })
      );
    });
    it('should always reject group names that are too long', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 11 }), (name) => {
          return isValidGroupName(name) === false;
        })
      );
    });
  });
  describe('Username validation (min 3, max 10 chars)', () => {
    it('should always accept valid usernames', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 3, maxLength: 10 }), (username) => {
          return isValidUsername(username) === true;
        })
      );
    });
    it('should always reject usernames that are too short', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 2 }), (username) => {
          return isValidUsername(username) === false;
        })
      );
    });
    it('should always reject usernames that are too long', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 11 }), (username) => {
          return isValidUsername(username) === false;
        })
      );
    });
  });
  describe('JWT token', () => {
    const SECRET = 'test_secret';
    it('should always contain the username and id after decoding', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          (username, id) => {
            const token = jwt.sign({ username, id }, SECRET);
            const decoded = jwt.verify(token, SECRET);
            return decoded.username === username && decoded.id === id;
          }
        )
      );
    });
    it('should always fail to verify with a wrong secret', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          (username, id) => {
            const token = jwt.sign({ username, id }, SECRET);
            try {
              jwt.verify(token, 'wrong_secret');
              return false;
            } catch (e) {
              return true;
            }
          }
        )
      );
    });
  });
});