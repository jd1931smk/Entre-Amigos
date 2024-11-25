import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Truck, MapPin } from 'lucide-react';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    toast.success(`Order marked as ${newStatus}`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'dispatched':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewMap = (order: Order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id.slice(-4)}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Details</h4>
                <p className="font-medium">Name: {order.customerName}</p>
                <p className="font-medium">Phone: {order.phoneNumber}</p>
                <p className="font-medium">Address: {order.address}</p>
                <p className="flex items-center gap-2 cursor-pointer text-beige-700 hover:text-beige-800" onClick={() => handleViewMap(order)}>
                  <MapPin size={16} />
                  View on map
                </p>
                <p className="font-medium">Delivery Time: {order.deliveryTime}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <ul className="space-y-2">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity}× {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t">
                  <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {selectedOrder?.id === order.id && order.coordinates && order.coordinates.lat !== 0 && (
              <div className="mb-4 h-64 rounded-lg overflow-hidden">
                <MapContainer
                  center={[order.coordinates.lat, order.coordinates.lng]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[order.coordinates.lat, order.coordinates.lng]} />
                </MapContainer>
              </div>
            )}

            <div className="flex gap-4">
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  <CheckCircle2 size={20} />
                  Mark as Preparing
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'dispatched')}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  <Truck size={20} />
                  Mark as Dispatched
                </button>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}