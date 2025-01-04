"use client";

import React, { useState, useEffect } from 'react';
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
import { addProduct, updateProductDetails } from '@/lib/actions/product.action';
import { useToast } from '@/hooks/use-toast';

interface AddProductProps {
  Open: boolean;
  onClose: () => void;
  productId?: string;
  field: string;
  setCount: (value: number) => void;
  productData?: {
    productName?: string;
    price?: number;
    productDetails?: string;
    category?: string;
    image?: File | null;
  };
}

const productSchema = z.object({
  productName: z.string().nonempty("Product name is required"),
  price: z.coerce.number(),
  image: z
    .any()
    .refine(
      (file, ctx) => {
        if (!file && !ctx.parent.productId) {
          return false;
        }
        return true;
      },
      { message: "Image is required" }
    )
    .optional(),
  productDetails: z.string().optional(),
  category: z.string().optional(),
});

const ProductHandler: React.FC<AddProductProps> = ({ Open, onClose, productId, field, setCount, productData }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [fieldRequired, setFieldRequired] = useState('');

  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      price: 0,
      image: null,
      productDetails: "",
      category: "",
    },
  });


  useEffect(() => {
    if (productData) {
      form.reset({
        productName: productData.productName || "",
        price: productData.price || 0,
        image: productData.image || null,
        productDetails: productData.productDetails || "",
        category: productData.category || "",
      });
      setFieldRequired(false);
    } else {
      setFieldRequired(true);
    }
  }, [productData, form]);

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    console.log("On Submit function triggered")
    setLoading(true);
    try {
      if (productId) {
        if (!values) {
          return toast({
            title: "Something unexpected happened"
          });
        }
        console.log(productId, "From product Handlder")

        await updateProductDetails(
          productId,
          {
            productName: values?.productName,
            price: values?.price,
            image: values?.image,
            productDetails: values?.productDetails,
            category: values?.category,
          }
        );

        toast({
          title: "Product Updated Successfully"
        })
      } else {
        console.log("Add product function called")
        if (!values) {
          return toast({
            title: "Something unexpected happened"
          });
        }
        await addProduct({
          productName: values.productName,
          price: values.price,
          image: values.image,
          productDetails: values?.productDetails,
          category: values?.category,
        });

        setCount((prev) => prev + 1);
        toast({
          title: "Product Added Successfully",
        });
      }

      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Unexpected error occurred. Try again later.",
      });
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
                    <Input placeholder="name" {...field} required={!productId} />
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
                      <Input placeholder="price" {...field} required={!productId} type='number' />
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
                      <Input placeholder="category" {...field} required={!productId} />
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
                      required={fieldRequired}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className={`${loading && "cursor-not-allowed"} text-[1vw]`} type="submit" disabled={loading}>
              {loading ? "Loading..." : productId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHandler;
