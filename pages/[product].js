import { useState } from "react"
import Image from "next/image"
import { callShopify, Slugs, singleProduct } from "../helpers/shopify"

const ProductDetails = ({ productData }) => {
  const [isLoading, setIsLoading] = useState(false)

  const imageNode = productData.images.edges[0].node
  const title = productData.title
  const price = productData.priceRange.maxVariantPrice.amount.replace(/\.0/g, '')
  const description = productData.description
  const productVariant = productData.variants.edges[0].node.id

  
  const checkout = async () => {

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
      setIsLoading(true)

      const response = await fetch(fetchUrl, fetchOptions)

      if (!response.ok) {
        let message = await response.json()
        message = message.error
        throw new Error(message)
      }

      const data = await response.json()
      const { checkoutURL } = data
      window.location.href = checkoutURL

    } catch (e) {
      throw new Error(e)
    }

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
            src={imageNode.url}
            alt=""
            width={imageNode.width}
            height={imageNode.height}
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
          {title}
        </h1>
        <h2 className="text-2xl tracking-wide sm:py-8 py-6">${price}</h2>
        <p className="text-gray-600 leading-7">{description}</p>
        <div className="my-6"></div>
        <button
          className="text-sm tracking-wider bg-black text-white font-semibold py-4 px-12 border-2 border-black hover:border-transparent w-full"
          onClick={checkout}
        >
          {isLoading && (
            <svg className="inline animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          )}
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
