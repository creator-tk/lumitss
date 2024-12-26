declare interface Product {
  $id: string;
  image: string;
  productName: string;
  productDetails: string;
  price: number;
}

declare interface User {
  fullName: string;
  email: string;
  accountId: string;
}
declare interface ActionResult {
  success: boolean;
  message: string;
}
declare interface Session {
  secret: string;
  $id: string;
}
declare interface UserResponse {
  $id: string;
  email: string;
  fullName: string;
  accountId: string;
}

declare interface OTPResponse {
  accountId: string;
}
declare interface ServerError {
  message: string;
}
