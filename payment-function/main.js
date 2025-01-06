/* eslint-disable @typescript-eslint/no-unused-vars */
 export default async function main({ req, res, log }) {
  log("Function triggered!");
  const {currency, amount} = req.body;
  return res.json({ message: "Function executed successfully!", Currency: currency }, 200);
};
