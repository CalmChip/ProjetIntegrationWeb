const express = require("express");
const Cart = require("../models/carts");
const Products = require("../models/products");
const router = express.Router();
const cookie = require("cookie");

//get cart items gotta add, isAuthorized
router.get("/", async (req, res) => {
  let testUser = req.user;
  let owner;
  if (testUser) {
    owner = req.user._id;
  } else {
    let testCookie = cookie.parse(req.headers.cookie);
    if (testCookie.name) {
      const cookies = cookie.parse(req.headers.cookie || "");
      owner = cookies.name;
      console.log("Test Cookie: " + owner);
    } else {
      const uniqueCookie = `${Math.random() * 10}${Math.random() * 20}`;
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("name", uniqueCookie, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // = 1 week.
        })
      );
      const cookies = cookie.parse(req.headers.cookie || "");
      owner = cookies.name;
      console.log("Not tested cookie:", owner);
    }
  }
  try {
    const cart = await Cart.findOne({ owner });
    if (cart && cart.items.length > 0) {
      res.render("cart", { cart: cart });
      console.log("Objet Cart: ", cart);
    } else {
      res.render("cart");
    }
  } catch (error) {
    res.status(500).send("Oops! something went wrong...");
  }
});

//add cart
router.post("/cart/:id", async (req, res) => {
  let test = req.user;
  let owner;
  if (test) {
    owner = req.user._id;
  } else {
    let testCookie = cookie.parse(req.headers.cookie);
    if (testCookie) {
      const cookies = cookie.parse(req.headers.cookie || "");
      owner = cookies.name;
      console.log("Test Cookie: " + owner);
    } else {
      const uniqueCookie = `${math.Random() * 10}${math.Random() * 20}`;
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("name", uniqueCookie, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // = 1 week.
        })
      );
      const cookies = cookie.parse(req.headers.cookie || "");
      owner = cookies.name;
      console.log("Not tested cookie:", owner);
    }
  }
  let itemId = req.params.id;
  const cart = await Cart.findOne({ owner });
  Products.getProductByID(itemId, (err, item) => {
    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    console.log("Test create cart: ", item);
    const price = item.price;
    const name = item.productName;
    const productPicture = item.productPicture;
    const quantity = 1;
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
        cart.save().then(() => {
          res.render("cart", { cart: cart });
        });
      } else {
        cart.items.push({ itemId, name, quantity, price, productPicture });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        cart.save().then(() => {
          res.render("cart", { cart: cart });
        });
      }
    } else {
      //no cart exists, create one
      const newCart = Cart.create({
        owner,
        items: [{ itemId, name, quantity, price, productPicture }],
        bill: quantity * price,
      }).then(() => {
        res.render("cart", { cart: newCart });
      });
    }
  });
});

//delete item in cart

router.delete("/cart/:id", async (req, res) => {
  let test = req.user;
  let owner;
  if (test) {
    owner = req.user._id;
  } else {
    let testCookie = cookie.parse(req.headers.cookie);
    if (testCookie) {
      const cookies = cookie.parse(req.headers.cookie || "");
      owner = cookies.name;
      console.log("Test Cookie: " + owner);
    } else {
      const uniqueCookie = `${math.Random() * 10}${math.Random() * 20}`;
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("name", uniqueCookie, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // = 1 week.
        })
      );
      const cookies = cookie.parse(req.headers.cookie || "");
      owner = cookies.name;
      console.log("Not tested cookie:", owner);
    }
  }
  const itemId = req.params.id;
  try {
    let cart = await Cart.findOne({ owner: owner });
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
      res.render("cart", { cart: cart });
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
