import { callShopify, updateCheckout } from "../../../helpers/shopify";

export default async function UpdateCheckout(req, res) {
  const { products, checkoutId } = req.body;

  const lineItems = products.map((product) => {
    return {
      variantId: product.productVariantId,
      quantity: product.variantQuantity,
    };
  });

  const variables = {
    checkoutId,
    lineItems,
  };

  try {
    const response = await callShopify(updateCheckout, variables);

    const { webUrl, id } = response.data.checkoutLineItemsReplace.checkout;

    if (response.status >= 400) {
      return res.status(400).json({
        error: `There was an error generating the checkoutURL. Please try again.`,
      });
    }
    return res.status(201).json({ checkoutURL: webUrl, checkoutId: id });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: `There was an error generating the checkoutURL. Please try again.`,
    });
  }
}
