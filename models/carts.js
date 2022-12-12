const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    ref: "usagers",
  },
  items: [
    {
      itemId: {
        type: String,
        ref: "products",
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: Number,
    },
  ],
});

let Carts = (module.exports = mongoose.model("carts", cartSchema));
