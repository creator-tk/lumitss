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
import { Loader } from "lucide-react";

interface AddressPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  popUpVisible: ()=>void;
  paymentAddress: ()=>void;
}

const AddressPopUp = ({ isOpen, onClose, popUpVisible, paymentAddress }: AddressPopUpProps) => {
  const [address, setAddress] = useState({
    country: "",
    phone: "",
    area: "",
    pincode: "",
    street: "",
    landmark: "",
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const addAddressHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const addressString = JSON.stringify(address);

    paymentAddress(addressString)
    popUpVisible(true);

      setAddress({
        country: "",
        phone: "",
        area: "",
        pincode: "",
        street: "",
        landmark: "",
      });
      toast({
        title: "Address added successfully",
        duration:"2000"
      });
      onClose();
      setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Enter Address</DialogTitle>
        <form className="flex flex-col gap-4" onSubmit={addAddressHandler}>
          <div>
            <label htmlFor="country" className="block text-sm font-medium">Country</label>
            <Select
              value={address.country}
              onValueChange={(value) => onSelectChangeHandler("country", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIA">India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
            <Input
              type="number"
              placeholder="Phone"
              required
              id="phone"
              name="phone"
              value={address.phone}
              onChange={onChangeHandler}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium">Area</label>
              <Input
                type="text"
                placeholder="Location"
                id="area"
                required
                name="area"
                value={address.area}
                onChange={onChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium">PinCode</label>
              <Input
                type="number"
                placeholder="PinCode"
                id="pincode"
                required
                name="pincode"
                value={address.pincode}
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium">Street</label>
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
            <label htmlFor="landmark" className="block text-sm font-medium">LandMark</label>
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
            className={`mt-4 ${loading && "cursor-not-allowed"}`}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin"/> : "Add Address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressPopUp;
