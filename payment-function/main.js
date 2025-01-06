/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = async function main({ req, res, log }) {
  log("Function triggered!");
  return res.json({ message: "Function executed successfully!" }, 200);
};
