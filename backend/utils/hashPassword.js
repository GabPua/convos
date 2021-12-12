const { randomBytes, createHmac } = require('crypto');

function hashPassword(password, salt = randomBytes(32).toString('hex')) {
  const hashedPassword = createHmac('sha512', salt).update(password).digest('hex');
  return { salt, password: hashedPassword };
}

function matchPassword(password, hashedPassword, salt) {
  return hashPassword(password, salt).password === hashedPassword;
}

module.exports = {
  hashPassword,
  matchPassword,
};