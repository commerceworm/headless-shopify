import { createContext, useState, useEffect } from "react";
import { callShopify, createCheckout } from "../helpers/shopify";

const CartContext = createContext();

export default function ShopProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutId, setCheckoutId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  useEffect(() => {
    console.log(cartOpen);
    console.log(checkoutId)
    console.log(checkoutUrl)
    console.log(cart.length)
  }, [cartOpen, checkoutId, checkoutUrl]);

  const checkout = async (productVariant) => {

    const fetchUrl = "/api/checkout"

    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variantId: productVariant,
      }),
    }

    try {

      const response = await fetch(fetchUrl, fetchOptions)

      if (!response.ok) {
        let message = await response.json()
        throw new Error(message)
      }

      const data = await response.json()

      return data
  

    } catch (e) {
      throw new Error(e)
    }

  }

  async function addToCart(addedItem) {
    const newItem = { ...addedItem };
    setCartOpen(true);

    if (cart.length === 0) {
      setCart([newItem]);
      const checkoutData = await checkout(newItem.variants.edges[0].node.id);

      setCheckoutId(checkoutData.checkoutId)
      setCheckoutUrl(checkoutData.checkoutURL)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        setCartOpen,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
