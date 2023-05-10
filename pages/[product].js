import { useState, useContext } from "react"
import Image from "next/image"
import { CartContext } from "../context/shopContext"
import { callShopify, Slugs, singleProduct } from "../helpers/shopify"

const ProductDetails = ({ productData }) => {

  const { addToCart } = useContext(CartContext)

  const product = {
    imageNode: productData.images.edges[0].node,
    title: productData.title,
    handle: productData.handle,
    price: productData.priceRange.maxVariantPrice.amount.replace(/\.0/g, ''),
    description: productData.description,
    productVariantId: productData.variants.edges[0].node.id,
    variantQuantity: 1
  }

  return (
    <div
      className="
        px-4
        sm:py-12
        md:flex-row
        py-4 w-full flex flex-col my-0 mx-auto
        max-w-7xl
      "
    >
      <div className="w-full flex flex-1">
        <div className="w-full h-full relative">
          <Image
            src={product.imageNode.url}
            alt=""
            width={product.imageNode.width}
            height={product.imageNode.height}
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="pt-2 px-0 md:px-10 pb-8 w-full md:w-1/2">
        <h1
          className="
           sm:mt-0 mt-2 text-5xl font-light leading-large
          "
        >
          {product.title}
        </h1>
        <h2 className="text-2xl tracking-wide sm:py-8 py-6">${product.price}</h2>
        <p className="text-gray-600 leading-7">{product.description}</p>
        <div className="my-6"></div>
        <button
          className="text-sm tracking-wider bg-black text-white font-semibold py-4 px-12 border-2 border-black hover:border-transparent w-full"
          onClick={() => {
            addToCart(product)
          }}
        >
          <span>Buy</span>
        </button>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const response = await callShopify(Slugs)
  const productSlugs = response.data.products.edges

  const paths = productSlugs.map((slug) => {    
    const product = String(slug.node.handle)
    return {
      params: { product }
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const response = await callShopify(singleProduct, { handle: params.product })
  const productData = response.data.product

  return {
    props: {
      productData,
    },
  }
}

export default ProductDetails
