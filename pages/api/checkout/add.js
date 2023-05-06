import { callShopify, addCheckout } from "../../../helpers/shopify";

export default async function Subscribe(req, res) {
  const { product, checkoutId } = req.body;

  const variables = {
    checkoutId,
    lineItems: [
      {
        quantity: 1,
        variantId: product.productVariantId,
      },
    ],
  };

  try {
    const response = await callShopify(addCheckout, variables);

    const { webUrl, id } = response.data.checkoutLineItemsAdd.checkout;

    const title =
      response.data.checkoutLineItemsAdd.checkout.lineItems.edges[0].node.title;

    const addedProductData =
      response.data.checkoutLineItemsAdd.checkout.lineItems.edges;

    let lineItemsId = ""

    addedProductData.map((item) => {
      if (item.node.variant.id === product.productVariantId) {
        lineItemsId = item.node.id;
      }
    });

    if (response.status >= 400) {
      return res.status(400).json({
        error: `There was an error generating the checkoutURL. Please try again.`,
      });
    }
    return res
      .status(201)
      .json({
        checkoutURL: webUrl,
        checkoutId: id,
        lineItemsId: lineItemsId,
        addedData: addedProductData,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: `There was an error generating the checkoutURL. Please try again.`,
    });
  }
}
