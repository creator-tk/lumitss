import Razorpay from "razorpay";

export default async function main({ req, res, log }) {
  log("Function triggered!");

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const { currency = "INR", amount = 100 } = req.body;  // Directly using req.body

  log("requestBody:", req.body);
  log("currency:", currency, "Amount:", amount);

  // Input validation
  if (!currency || !amount) {
    return res.json({
      error: "Currency and amount are required",
    });
  }

  const options = {
    amount: amount * 100,  // Razorpay expects the amount in paise
    currency,
    receipt: `receipt_${Date.now()}`
  };

  try {
    // Attempt to create an order
    const order = await razorpay.orders.create(options);

    // Send the order details as a response
    return res.json({
      message: "Order created successfully!",
      order,
    });
  } catch (error) {
    // Handle any errors from Razorpay API
    log("Error creating Razorpay order:", error);
    return res.status(500).json({
      error: "Failed to create order with Razorpay",
    });
  }
}
