import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { MenuItem, OrderItem } from '../types';
import AddressSearch from './AddressSearch';

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 11; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 17 && minute > 30) break;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function CustomerOrder() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: ''
  });

  useEffect(() => {
    const savedMenu = localStorage.getItem('dailyMenu');
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu));
    }
  }, []);

  const handleAddressSelect = (address: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      address
    }));
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`Added ${item.name} to cart`);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = () => {
    // Validate all required fields
    if (!customerInfo.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!customerInfo.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!customerInfo.address.trim()) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!customerInfo.deliveryTime) {
      toast.error('Please select a delivery time');
      return;
    }
    if (cart.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }

    const order = {
      id: Date.now().toString(),
      items: cart,
      total,
      customerName: customerInfo.name.trim(),
      phoneNumber: customerInfo.phone.trim(),
      address: customerInfo.address.trim(),
      deliveryTime: customerInfo.deliveryTime,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

      // Reset form
      setCart([]);
      setCustomerInfo({
        name: '',
        phone: '',
        address: '',
        deliveryTime: ''
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Today's Menu</h2>
          <div className="grid gap-6">
            {menu.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-beige-600 text-white px-4 py-2 rounded hover:bg-beige-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ShoppingBag />
            Your Order
          </h2>

          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          )}

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone size={16} />
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
              </div>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="mt-1 block w-full"
                required
              />
            </div>

            <AddressSearch onAddressSelect={handleAddressSelect} />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} />
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Time
                </label>
              </div>
              <select
                value={customerInfo.deliveryTime}
                onChange={e => setCustomerInfo({ ...customerInfo, deliveryTime: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beige-400 focus:ring focus:ring-beige-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select delivery time</option>
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSubmitOrder}
              className="w-full bg-beige-600 text-white py-3 rounded-lg hover:bg-beige-700 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}