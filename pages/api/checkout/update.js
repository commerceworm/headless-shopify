import { callShopify, updateCheckout } from "../../../helpers/shopify";

export default async function Subscribe(req, res) {
  const { product, checkoutId } = req.body;

    const variables = {
        checkoutId,
        lineItems: [
            {
                id: product.lineItemId,
                quantity: product.variantQuantity,
                variantId: product.productVariantId
            }
        ]
    }

  try {
    const response = await callShopify(updateCheckout, variables);

    const { webUrl, id } = response.data.checkoutLineItemsUpdate.checkout;
    const lineItemsId = response.data.checkoutLineItemsUpdate.checkout.lineItems.edges[0].node.id

    if (response.status >= 400) {
      return res.status(400).json({
        error: `There was an error generating the checkoutURL. Please try again.`,
      });
    }
    return res.status(201).json({ checkoutURL: webUrl, checkoutId: id, lineItemsId: lineItemsId });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: `There was an error generating the checkoutURL. Please try again.`,
    });
  }
}