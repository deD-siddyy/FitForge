const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token.
 * @param {string} id - The user's MongoDB _id.
 * @returns {string} Signed JWT token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
