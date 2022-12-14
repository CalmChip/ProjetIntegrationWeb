const mongoose = require("mongoose");

//Schema for the collection users

let schemaUsers = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
    required: true,
    default: ["user"],
  },
  cart: {
    type: Array,
  },
  verified: {
    type: Boolean,
    default: false,
    required: false,
  },
});

let Users = (module.exports = mongoose.model("users", schemaUsers));

// Delete user by _id
module.exports.deleteUser = (idUser, callback) => {
  let filtre = { _id: idUser };
  Users.deleteOne(filtre, callback);
};

// Find user by _id
module.exports.getUserById = (idUser, callback) => {
  Users.findById(idUser, callback);
};

// Find user by email
module.exports.getUserByEmail = (filter, callback) => {
  let query = {
    email: { $regex: filter },
  };
  Users.find(query, callback);
};

// Modify User by _id
module.exports.modifyUser = (idUSer, newUser, callback) => {
  let filtre = { _id: idUSer };
  let options = {};
  let user = {
    _id: newUser._id,
    name: newUser.nom,
    password: newUser.password,
    roles: newUser.roles,
  };
  Users.findOneAndUpdate(filtre, user, options, callback);
};

// API to verify users
module.exports.verifyUsers = (idUser, callback) => {
  let filter = { _id: idUser };
  let options = {};
  let user = {
    verified: true,
  };
  Users.findOneAndUpdate(filter, user, options, callback);
};
