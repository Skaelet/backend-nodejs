const { normalize, schema } = require('normalizr');
const bCrypt = require('bcrypt');

const normalizeData = (msg) => {
  const user = new schema.Entity("users");
  const messages = new schema.Entity("mensajes", {
    author: user,
  });
  const chats = new schema.Entity("chats", { chats: [messages] });
  return normalize(msg, chats);
}

const createHash = (password) => {
  return bCrypt.hashSync(
    password,
    bCrypt.genSaltSync(10),
    null);
}

const isValidPassword = async(user, password) => {
  console.log(await bCrypt.compare(password, await user.password));
  return await bCrypt.compare(password, await user.password)
}

module.exports = { normalizeData, createHash, isValidPassword };