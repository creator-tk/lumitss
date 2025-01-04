import { initializePayment } from "../appwrite";
import { NextApiRequest, NextApiResponse } from "next";

export const handlePayment = async (req : NextApiRequest, res:NextApiResponse)=>{
  try {
    if(req.method === "POST"){
      const {amount, currency} = req.body;

      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      const payment = await initializePayment(amount,currency);

      res.status(200).json(payment);
    }else{
      res.status(405).json({message: "Method not allowed"});
    }
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
    console.log("Error:",error.message)
  }
}