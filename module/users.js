const firebase = require("firebase");

const usersSchema = function Users(name, phone) {
  this.name = name;
  this.phone = phone;
};

module.exports = usersSchema;
