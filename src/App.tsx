import React, { useState } from 'react';
import { ChefHat, ShoppingBag, ClipboardList } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import AdminPanel from './components/AdminPanel';
import CustomerOrder from './components/CustomerOrder';
import OrderManagement from './components/OrderManagement';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState<'customer' | 'admin' | 'orders'>('customer');

  return (
    <div className="min-h-screen bg-beige-50">
      <Toaster position="top-right" />
      <nav className="bg-primary-900 text-beige-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-beige-300" />
              <span className="ml-2 text-xl font-bold">Entre Amigos</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsAdmin(!isAdmin);
                  setActiveView(isAdmin ? 'customer' : 'admin');
                }}
                className={`px-4 py-2 rounded-lg ${
                  isAdmin ? 'bg-red-500 text-white' : 'bg-beige-500 text-primary-900 hover:bg-beige-600'
                }`}
              >
                {isAdmin ? 'Exit Admin' : 'Admin Mode'}
              </button>
              
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('admin')}
                    className={`p-2 rounded-lg flex items-center gap-2 ${
                      activeView === 'admin' ? 'bg-primary-800' : 'hover:bg-primary-800'
                    }`}
                  >
                    <ChefHat size={20} />
                    Menu
                  </button>
                  <button
                    onClick={() => setActiveView('orders')}
                    className={`p-2 rounded-lg flex items-center gap-2 ${
                      activeView === 'orders' ? 'bg-primary-800' : 'hover:bg-primary-800'
                    }`}
                  >
                    <ClipboardList size={20} />
                    Orders
                  </button>
                </div>
              )}
              
              {!isAdmin && (
                <button
                  onClick={() => setActiveView('customer')}
                  className="p-2 rounded-lg flex items-center gap-2 hover:bg-primary-800"
                >
                  <ShoppingBag size={20} />
                  Order Now
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {isAdmin ? (
          activeView === 'admin' ? <AdminPanel /> : <OrderManagement />
        ) : (
          <CustomerOrder />
        )}
      </main>
    </div>
  );
}

export default App;