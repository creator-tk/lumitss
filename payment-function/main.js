import Razorpay from "razorpay";

export default async function main({ req, res, log }) {
  log("Function triggered!");

  // Log API keys (DO NOT log your secret key in production)
  log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
  log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

  const razorpay = new Razorpay({
    key_id:"rzp_test_DCEhb7USpZ3Chq",
    key_secret:"05xtdn20ftv8ANiAEK5gEYHf",
  });

  const { currency = "INR", amount } = req.body;

  log("requestBody:", req.body);
  log("currency:", currency, "Amount:", amount);

  if (!currency || !amount) {
    return res.json({
      error: "Currency and amount are required",
    });
  }

  const options = {
    amount: amount * 100,  // Razorpay expects the amount in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    // Attempt to create an order
    const order = await razorpay.orders.create(options);

    return res.json({
      message: "Order created successfully!",
      order,
    });
  } catch (error) {
    // Handle any errors from Razorpay API
    log("Error creating Razorpay order:", error);
    return res.json({
      error: "Failed to create order with Razorpay",
    });
  }
}
