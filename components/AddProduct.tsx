import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addProduct } from '@/lib/actions/product.action';
import { useToast } from '@/hooks/use-toast';

interface AddProductProps {
  Open: boolean;
  onClose: () => void;
  productId: string;
  field: string;
  setCount: (value:number) => void;
}

const productSchema = z.object({
  productName: z.string().nonempty("Product name is required"),
  price: z.coerce.number(),
  image: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, { message: "Image is required" }),
  productDetails: z.string().optional(),
  category: z.string().optional(), 
});


const AddProduct: React.FC<AddProductProps> = ({ Open, onClose, field, setCount }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {toast} = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      price: 0,
      image: undefined,
      productDetails:"",
      category: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    console.log("Uploaded Image", values.image)
    if (!(values.image instanceof File)) {
      console.error("Image is not a valid File.");
      throw new Error("Image is not a file")
    }
    setLoading(true);
    try {
      const product = await addProduct({
        productName: values.productName,
        price: values.price,
        image: values.image,
        productDetails: values?.productDetails,
        category: values?.category,
      });

      if (product) {
        setCount((prev) => prev = prev+1); 
        toast({
          title: "Product Added Successfully"
        });
      } else{
        onClose();
        throw new Error("Something went wrong Plz after some time")
      }
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Some unexpeted happend try after some time."
      })
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='flex flex-col'>
        <Button className='self-end' onClick={onClose}>Close</Button>
        <DialogHeader>
          <DialogTitle className='text-[2vw]'>{field} product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="price" {...field} required type='number' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="category" {...field} required /> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productDetails"
              render={({ field }) => (
                <FormItem className='flex flex-col gap-1'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea placeholder="Description about the product" {...field} className='bordered p-1' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className={`${loading && "cursor-not-allowed"} text-[1vw]`} type="submit" disabled={loading}>{loading ? "Loading..." : field}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;