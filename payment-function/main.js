import Razorpay from "razorpay";

export default async function main({ req, res, log }) {
  log("Headers:", JSON.stringify(req.headers));
  log("Raw body:", JSON.stringify(req.body));

  // CORS headers to allow all origins (can replace * with specific domains)
  res.setHeader('Access-Control-Allow-Origin', '*');  // Or specify the allowed origin (e.g. 'http://example.com')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Add other methods if necessary
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Specify required headers

  // Handle preflight requests for OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Ensure the request is parsed correctly if JSON
  if (req.headers["content-type"] === "application/json" && typeof req.body === 'string') {
    req.body = JSON.parse(req.body); // Parse JSON string if it's not automatically parsed
  }

  const { currency = "INR", amount } = req.body;

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
