import Razorpay from "razorpay";

export default async function main({ req, res, log }) {
  log("Function triggered!");

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Parse body for x-www-form-urlencoded
  log(res.json(typeof req.body));
  let request = req.body
  const { currency = "INR", amount } = request;

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
