import { createContext, useState, useEffect } from "react";
import { checkout, updateCheckout } from "../helpers/checkout"

const CartContext = createContext();

export default function ShopProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutId, setCheckoutId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    console.log(cart)
    console.log(checkoutUrl)
  }, [cart]);

  async function addToCart(addedItem) {
    const newItem = { ...addedItem };
    setCartOpen(true);

    if (cart.length === 0) {
      const productVariant = newItem.productVariantId

      setCart([newItem]);
      const checkoutData = await checkout(productVariant);


      setCheckoutId(checkoutData.checkoutId)
      setCheckoutUrl(checkoutData.checkoutURL)
    } else {

      let newCart = []
      let added = false

      cart.map((async (item) => {
        if (item.productVariantId === newItem.productVariantId) {
          item.variantQuantity++
          added = true
          newCart = [...cart]
        }
      }))

      if (!added) {
        newCart = [...cart, newItem]
      }
      setCart(newCart)
      const newCheckout = await updateCheckout(newCart, checkoutId)
    }
  }

  async function removeCartItem(itemToRemove) {
    const updatedCart = cart.filter(item => item.productVariantId !== itemToRemove)
    setCartLoading(true)

    setCart(updatedCart)

    const newCheckout = await updateCheckout(updatedCart, checkoutId)

    setCartLoading(false)

    if (cart.length === 1) {
      setCartOpen(false)
    }
  }

  async function incrementCartItem(item) {
    setCartLoading(true)

    let newCart = []

    cart.map(cartItem => {
      if (cartItem.productVariantId === item.productVariantId) {
        cartItem.variantQuantity++
        newCart = [...cart]
      }
    })
    setCart(newCart)
    const newCheckout = await updateCheckout(newCart, checkoutId)

    setCartLoading(false)
  }

  async function decrementCartItem(item) {
    setCartLoading(true)

    if (item.variantQuantity === 1) {
      removeCartItem(item.productVariantId)
    } else {
      let newCart = []
      cart.map(cartItem => {
        if (cartItem.productVariantId === item.productVariantId) {
          cartItem.variantQuantity--
          newCart = [...cart]
        }
      })

      setCart(newCart)
      const newCheckout = await updateCheckout(newCart, checkoutId)
    }
    setCartLoading(false)
  }

  async function clearCart() {
    const updatedCart = []

    setCart(updatedCart)

    const newCheckout = await updateCheckout(updatedCart, checkoutId)

    setCartOpen(false)

  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        cartLoading,
        checkoutUrl,
        setCartOpen,
        addToCart,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
