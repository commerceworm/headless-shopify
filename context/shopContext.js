import { createContext, useState, useEffect } from "react";
import { checkout, updateCheckout, addCheckout } from "../helpers/checkout"

const CartContext = createContext();

export default function ShopProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutId, setCheckoutId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  useEffect(() => {
    console.log(cart)
    console.log(checkoutUrl)
  }, [cart]);

  async function addToCart(addedItem) {
    const newItem = { ...addedItem };
    setCartOpen(true);

    if (cart.length === 0) {
      const productVariant = newItem.productVariantId
      const checkoutData = await checkout(productVariant);

      newItem.lineItemId = checkoutData.checkoutLineItemId

      setCart([newItem]);
      setCheckoutId(checkoutData.checkoutId)
      setCheckoutUrl(checkoutData.checkoutURL)
    } else {

      let newCart = []
      let added = false

      cart.map((async (item) => {
        if (item.productVariantId === newItem.productVariantId) {
          item.variantQuantity++
          console.log(`Updated Item Id ${item.lineItemId}`)
          added = true
          newCart = [...cart]
          const updatedCheckoutData = await updateCheckout(item, checkoutId)
          setCheckoutId(updatedCheckoutData.checkoutId)
          setCheckoutUrl(updatedCheckoutData.checkoutURL)
        }
      }))

      if (!added) {
        const addedCheckoutData = await addCheckout(newItem, checkoutId)
        console.log(`Added LineItemId: ${addedCheckoutData.lineItemsId}`)
        newItem.lineItemId = addedCheckoutData.lineItemsId
        newCart = [...cart, newItem]
        setCheckoutId(addedCheckoutData.checkoutId)
        setCheckoutUrl(addedCheckoutData.checkoutURL)
      }
      console.log(added)
      setCart(newCart)
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
