import Razorpay from "razorpay";

export default async function main({ req, res, log }) {
  log("Function triggered!");

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const body = JSON.parse(req.body || "{}");
  const { currency, amount } = body;

  log("currency:" , currency, "Ammount":amount);

  if (!currency || !amount) {
    return res.json({
      error: "Currency and amount are required",
    });
  }

  const options = {
    amount: amount*100,
    currency: currency || "INR",
    receipt: `receipt_${Date.now()}`
  }

  const order = await razorpay.orders.create(options);
  res.send(order);
  return res.json({
    message: "Function executed successfully!",
    Currency: currency,
    Amount: amount,
  });
}

