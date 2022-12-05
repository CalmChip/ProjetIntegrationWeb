const mongoose = require("mongoose");

//Schema for the collection users

let schemaUsers = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
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
        defaultL: ["user"]
    },
    cart: {
        type: Array
    }
});

let Users = module.exports = mongoose.model('users', schemaUsers);

// Delete user by _id
module.exports.deleteUser = (idUser, callback) => {
    let filtre = { "_id": idUser };
    Users.deleteOne(filtre, callback);
};

// Find user by _id
module.exports.getUserById = (idUser, callback) => {
    Users.findById(idUser, callback);
};

// Modify User by _id
module.exports.modifyUser = (idUSer, newUser, callback) => {
    let filtre = { "_id": idUSer };
    let options = {};
    let user = {
        _id: newUser._id,
        name: newUser.nom,
        password: newUser.password,
        roles: newUser.roles,
    };
    Users.findOneAndUpdate(filtre, user, options, callback);
}
