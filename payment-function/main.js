/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function main({ req, res, log }) {
  log("Function triggered!");

  const { currency, amount } = req.body;

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

