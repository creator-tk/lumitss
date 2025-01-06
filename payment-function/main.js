import Razorpay from "razorpay";

export default async function main({ req, res, log }) {
  log("Headers:", JSON.stringify(req.headers));

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // // Ensure the request is parsed correctly if JSON
  // if (req.headers["content-type"] === "application/json" && typeof req.body === 'string') {
  //   req.body = JSON.parse(req.body); // Parse JSON string if it's not automatically parsed
  // }

  // const { currency = "INR", amount } = req.body;

  const currency = req.query.currency;
  const amount = req.query.amount;

  log("Query:", req.query)
  log("Currency: ", currency);
  log("Currency: ", amount);

  if (!currency || !amount) {
    return res.json({
      error: "Currency and amount are required",
    });
  }

  const options = {
    amount: amount * 100, // Razorpay expects the amount in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.json({
        message: "Something unexpected happened!",
        status: "failed",
      });
    }
    return res.json({
      message: "Order created successfully!",
      order,
    });
  } catch (error) {
    log("Error creating Razorpay order:", error);
    return res.json({
      error: "Failed to create order with Razorpay",
    });
  }
}
