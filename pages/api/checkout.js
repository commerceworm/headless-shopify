import { callShopify, createCheckout } from "../../helpers/shopify";

export default async function Subscribe(req, res) {
  const { variantId } = req.body;

  try {
    const response = await callShopify(createCheckout, {
      variantId,
    });

    const { webUrl, id } = response.data.checkoutCreate.checkout;

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

