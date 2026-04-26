export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
}

export type CompletedOrderStatus = 'delivered';
export type ActiveOrderStatus = 'placed' | 'assembled' | 'shipped' | 'delivering';

export interface CompletedOrder {
  id: string;
  number: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: CompletedOrderStatus;
}

export interface ActiveOrder {
  id: string;
  number: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: ActiveOrderStatus;
}

export interface Address {
  id: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  isDefault?: boolean;
}

export interface Notification {
  id: string;
  icon: 'order' | 'promo' | 'delivery' | 'info';
  text: string;
  date: string;
  isRead: boolean;
}

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  img: string;
  cat: string;
}
