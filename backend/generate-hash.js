const bcrypt = require("bcryptjs");
const password = "123";
const hash = bcrypt.hashSync(password, 10);
console.log(`Правильный хеш для "${password}":`, hash);
