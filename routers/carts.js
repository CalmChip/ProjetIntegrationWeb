const express = require("express");
const Cart = require("../models/carts");
const Products = require("../models/products");
const router = express.Router();

//get cart items gotta add, isAuthorized
router.get("/", async (req, res) => {
  let test = req.user;
  let owner;
  if (test) {
    owner = req.user._id;
  } else {
    owner = "6389395491bde8cf3455335d"; // Add cookie cart functionality here
  }
  try {
    const cart = await Cart.findOne({ owner });
    if (cart && cart.items.length > 0) {
      res.render("cart", { cart: cart });
    } else {
      res.send(null);
    }
  } catch (error) {
    res.status(500).send("Test");
  }
});

//add cart
router.post("/cart", async (req, res) => {
  const owner = req.user._id;
  const { itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ owner });
    const item = await Products.findOne({ _id: itemId });

    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    const price = item.price;
    const name = item.name;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;

        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.items[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ itemId, name, quantity, price });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        items: [{ itemId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

//delete item in cart

router.delete("/cart/:produtID", async (req, res) => {
  const owner = req.user._id;
  const itemId = req.params.produtID;
  try {
    let cart = await Cart.findOne({ owner });

    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.bill -= item.quantity * item.price;
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.items.splice(itemIndex, 1);
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();
      res.status(200).send(cart);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
