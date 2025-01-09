declare interface Product {
  productName: string; 
  $id?: string;
  image: string ;
  productDetails?: string;
  price: number;
  category?: string;
  productId?:string;
}

declare interface AddProductProps {
  productName: string;
  price: number;
  productDetails?: string;
  category?: string;
  image: File | string | null;
}

declare interface Order {
  productId: string;
  orderDate: string;
  orderStatus: string;
  quantity: number;
}

declare interface PlaceOrderProps {
  location?: string | object;
  products: string[];
  quantity?: object;
  price: number;
}

declare interface User {
  fullName: string;
  email: string;
  accountId: string;
}

declare interface paymentResponseProps{
  razorpay_order_id:string;
  razorpay_payment_id:string;
  razorpay_signature:string;
}

// declare interface ActionResult {
//   success: boolean;
//   message: string;
// }
// declare interface Session {
//   secret: string;
//   $id: string;
// }
// declare interface UserResponse {
//   $id: string;
//   email: string;
//   fullName: string;
//   accountId: string;
// }

// declare interface OTPResponse {
//   accountId: string;
// }
// declare interface ServerError {
//   message: string;
// }


declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface AdminPageProps{
  params?: Promise<{field: string}>;
}

declare interface UserPageProps{
  params?: Promise<{type:string}>;
}
