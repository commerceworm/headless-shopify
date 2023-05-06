export const checkout = async (productVariant) => {

    const fetchUrl = "/api/checkout/create"

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

  export const updateCheckout = async (product, checkoutId) => {

    const fetchUrl = "/api/checkout/update"

    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        checkoutId
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

  export const addCheckout = async (product, checkoutId) => {

    const fetchUrl = "/api/checkout/add"

    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        checkoutId
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