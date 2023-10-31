const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");

const addToCart = async (req, res) => {
  try {
    let { productId, userId, quantity } = req.body;
    let product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found!");
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    let user = await User.findById(userId);
    if (cartItem) {
      cartItem.quantity += quantity;
      if (cartItem.quantity === 0) {
        cart.items.remove(cartItem);
      }
      // cartItem.discountPrice+= product.discountPrice * cartItem.quantity;
      // cartItem.discountPercent+= product.discountPercent;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discountPrice: product.discountPrice,
        discountPercent: product.discountPercent,
      });
    }
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cart.totaldiscountPrice = cart.items.reduce(
      (total, item) => total + item.discountPrice * item.quantity,
      0
    );
    await cart.save();
    user.cart = new Cart(cart);
    await user.save();
    return res.status(201).send({
      message: "Item added to cart successfully",
      cart,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// const updateCartItem = async (req, res) => {
//   const { productId, userId, quantity } = req.body;
//   try {
//     //   const product = await Product.findById(productId);
//     //   let cart = await Cart.findOne({ user: userId });
//     //   const cartItem = cart.items.find(
//     //     (item) => item.product.toString() === productId
//     //   );
//     //   cartItem.quantity = quantity;
//     //   cartItem.price = product.price * quantity;
//     //   cartItem.discountPrice = product.discountPrice * quantity;
//     //   cart.totalPrice = cart.items.reduce(
//     //     (total, item) => total + item.price * item.quantity ,
//     //     0,
//     //   );
//     //   console.log(cart.totalPrice,cart.totaldiscountPrice);
//     //   console.log(cart.items);
//     //   cart.totaldiscountPrice = cart.items.reduce(
//     //     (total, item) => total + item.discountPrice * item.quantity,
//     //     0
//     //   );
//     //   await cart.save()
//     //   return res.status(201).send({
//     //     message: "Item added to cart successfully",
//     //     cart,
//     //     success: true,
//     //   });
//     // } catch (error) {
//     //   return res.status(500).send({ error: error.message });
//     // }
//     const { productId, quantity } = req.body;
//     const userId = req.user._id; // Assuming you have user authentication in place

//     // Find the user's cart
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ error: "Cart not found" });
//     }

//     // Find the cart item to update
//     const cartItemIndex = cart.items.findIndex(
//       (item) => item.product == productId
//     );

//     if (cartItemIndex === -1) {
//       return res.status(404).json({ error: "Cart item not found" });
//     }

//     // Update the quantity of the cart item
//     cart.items[cartItemIndex].quantity = quantity;
//     cart.totalPrice = cart.items.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//     cart.totaldiscountPrice = cart.items.reduce(
//       (total, item) => total + item.discountPrice * item.quantity,
//       0
//     );
//     // Save the updated cart
//     await cart.save();

//     return res.json({
//       message: "Cart item quantity updated successfully",
//       cart,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Error updating cart item quantity" });
//   }
// };

const getCart = async (req, res) => {
  let { _id } = req.user;
  try {
    const cart = await Cart.findOne({ user: _id }).populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
      },
    });
    return res.status(201).send({ message: "Cart", cart });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("No cart found!");
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(201).send({ message: "Cart", cart });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { addToCart, getCart, removeCartItem };
