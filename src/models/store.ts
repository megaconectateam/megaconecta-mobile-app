import { ReportPaymentMethodsEnum, ReportStatusEnum } from './enums';

export interface MegaStoreOrder {
  address1: string;
  address2: string;
  city: string;
  country: string;
  created_date: string;
  delivery_total: string;
  details: MegaStoreOrderDetail[];
  full_name: string;
  id: number;
  order_status: ReportStatusEnum;
  order_total: string;
  payment_method: ReportPaymentMethodsEnum;
  product_total: string;
  reference: string;
  state: string;
}

export interface MegaStoreOrderDetail {
  product: MegaStoreProduct;
  subtotal: string;
}

export interface MegaStoreProduct {
  id: number;
  cost: string;
  denomination: string;
  description: string;
  in_stock: number;
  invalid_product: string;
  name: string;
  original_price: string;
  price: string;
  shopping_cart_text: string;
  shopping_cart_quantity: number;
  main_image: MegaStoreProductImage;
  category: MegaProductCategory;
  deliveries: MegaStoreProductDelivery[];
  details: MegaStoreProductDetail[];
  images: MegaStoreProductImage[];
}

export interface MegaProductCategory {
  id?: number;
  name: string;
  icon: string;
}

export interface MegaStoreProductDetail {
  id: number;
  title: string;
  description: string;
}

export interface MegaStoreProductDelivery {
  accept_municipes: string;
  accept_provinces: string;
  deliveryId: number;
  duration: string;
  exclude_municipes: string;
  exclude_provinces: string;
  id: number;
  name: string;
  price: string;
  type: string;
}

export interface MegaStoreProductImage {
  image_url: string;
}
