"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { placeOrder } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";

interface AddressPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

const AddressPopUp = ({ isOpen, onClose, productId }: AddressPopUpProps) => {

  const [address, setAddress] = useState({
    country: "",
    phone: "",
    area: "",
    pincode: "",
    street: "",
    landmark: "",
  });
  const [loading, setLoading] = useState(false);

  const route = useRouter();
  const {toast} = useToast();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSelectChangeHandler = (name: string, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const addressString = JSON.stringify(address)
    console.log("stringaddress from popup",addressString) 
    try {
      const result = await placeOrder({location:addressString, products:[productId]});
      console.log(result)
      if(!result.success){
        toast({
          title:"Failded to process"
        })
      }
      toast({
        title:result.message,
        description:"Your order got confirmed"
      })

      setAddress({
        country: "",
        phone: "",
        area: "",
        pincode: "",
        street: "",
        landmark: "",
      })
      onClose();
      route.push("/user/orders")

    } catch (error) {
      console.log(error.message)
      toast({
        title:'Failded to place order',
        description:"Process Failded"
      })
    }finally{
      setLoading(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Enter Address</DialogTitle>
        <form className="flex flex-col gap-2"
          onSubmit={handlePlaceOrder}
        >
          <div>
            <label htmlFor="country">Country</label>
            <Select
              value={address.country}
              onValueChange={(value) => onSelectChangeHandler("country", value)}
              required
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIA">India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="phone">Phone Number:</label>
            <Input
              type="number"
              placeholder="Phone"
              required
              className="bordered"
              id="phone"
              name="phone"
              value={address.phone}
              onChange={onChangeHandler}
            />
          </div>

          <div className="flex gap-2">
            <div>
              <label htmlFor="area">Area</label>
              <Input
                type="text"
                placeholder="Location"
                id="area"
                className="bordered"
                required
                name="area"
                value={address.area}
                onChange={onChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="pincode">PinCode</label>
              <Input
                type="number"
                placeholder="PinCode"
                id="pincode"
                className="bordered"
                required
                name="pincode"
                value={address.pincode}
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div>
            <label htmlFor="street">Street</label>
            <Input
              type="text"
              placeholder="Street"
              id="street"
              name="street"
              value={address.street}
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <label htmlFor="landmark">LandMark</label>
            <Textarea
              placeholder="Landmark"
              id="landmark"
              name="landmark"
              value={address.landmark}
              onChange={onChangeHandler}
            />
          </div>

          <Button
            type="submit"
            className="btn-class"
            disabled={loading}
          >
            {loading?"Placing your order":"Place Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressPopUp;
