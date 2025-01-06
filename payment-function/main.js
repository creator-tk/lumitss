import Razorpay from "razorpay";

export default async function main({req, res, log}) {
  log("Headers:", JSON.stringify(req.headers));
  log("UpdatedCode");

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  log("Entire Request", req);
  return res.test("I tried my best this was not working");


  if (!amount) {
    return res.json({
      error: "amount is required",
    });
  }

  const options = {
    amount: amount * 100, // Razorpay expects the amount in paise
    currency: "INR",
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
