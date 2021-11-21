const { randomBytes, createHmac } = require('crypto');

module.exports = function hashPassword(password, salt = randomBytes(32).toString('hex')) {
  const hashedPassword = createHmac('sha512', salt).update(password).digest('hex');
  return { salt, password: hashedPassword }
}
