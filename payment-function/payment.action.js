export async function main(req, res) {
  console.log("Function triggered!");

  return res.json({ message: "Function executed successfully!" }, 200);
}
