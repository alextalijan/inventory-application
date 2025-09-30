const bcrypt = require('bcrypt');
const saltRounds = 10; // A good balance between security and performance

const Hash = (function thatControllsHashing() {
  function hash(password) {
    return bcrypt.hash(password, saltRounds);
  }

  function compare(password, storedHash) {
    return bcrypt.compare(password, storedHash);
  }

  return { hash, compare };
})();

module.exports = Hash;
