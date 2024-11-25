export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  status: 'pending' | 'preparing' | 'dispatched';
  createdAt: string;
}

export interface AdminState {
  isAdmin: boolean;
  toggleAdmin: () => void;
}