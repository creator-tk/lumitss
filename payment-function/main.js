/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function main({ req, res, log }) {
  log("Function triggered!");

  const body = JSON.parse(req.body || "{}");
  const { currency, amount } = body;
  log("currency:" , currency, "amount" , amount);
  // Validate if required data exists
  if (!currency || !amount) {
    return res.json({
      error: "Currency and amount are required",
    });
  }

  // Return the proper response
  return res.json({
    message: "Function executed successfully!",
    Currency: currency,
    Amount: amount,
  });
}

