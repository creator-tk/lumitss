// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function main({req, res}) {
  console.log("Function triggered!");

  return res.json({ message: "Function executed successfully!" }, 200);
}
