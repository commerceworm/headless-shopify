import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../context/shopContext";
import MiniCart from "../components/minicart";

const Header = () => {
  const { cart, cartOpen, setCartOpen } = useContext(CartContext);

  let cartQuantity = 0
  cart.map(item => {
    return (cartQuantity += item?.variantQuantity)
  })

  return (
    <header className="border-b border-palette-lighter sticky top-0 z-20 bg-white">
      <div className="flex flex-row justify-between max-w-7xl px-6 mx-auto">
        <div className="py-4">
          <Link href="/" passHref>
            <span className="text-xl font-bold tracking-tight ml-1">
              Comfortably
            </span>
          </Link>
        </div>
        <div className="py-4 relative">
        <a 
          className="cursor-pointer"
          onClick={() => setCartOpen(!cartOpen)}
          >
          {cart.length > 0 ? (
            <span className="absolute bottom-8 left-3 z-20 text-xs rounded-full bg-red-500 w-4 h-4 text-center text-white">{cartQuantity}</span>
          ) : null}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 z-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          </a>
        </div>
      </div>
      <MiniCart cart={cart} />
    </header>
  );
};

export default Header;
