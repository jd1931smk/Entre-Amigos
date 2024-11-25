import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<{
    name: string;
    description: string;
    price: string;
    image: string;
  }>({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    const savedMenu = localStorage.getItem('dailyMenu');
    if (savedMenu) {
      try {
        setMenu(JSON.parse(savedMenu));
      } catch (error) {
        console.error('Error loading menu:', error);
        toast.error('Failed to load saved menu');
      }
    }
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name.trim() || !newItem.price || !newItem.image) {
      toast.error('Please fill in name, price, and upload an image');
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (menu.length >= 5) {
      toast.error('Maximum 5 items allowed in the menu');
      return;
    }

    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: price,
      image: newItem.image
    };

    try {
      const updatedMenu = [...menu, newMenuItem];
      setMenu(updatedMenu);
      localStorage.setItem('dailyMenu', JSON.stringify(updatedMenu));
      
      setNewItem({
        name: '',
        price: '',
        description: '',
        image: ''
      });
      
      toast.success('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleSaveMenu = () => {
    try {
      localStorage.setItem('dailyMenu', JSON.stringify(menu));
      toast.success('Menu saved successfully!');
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error('Failed to save menu');
    }
  };

  const handleRemoveItem = (id: string) => {
    try {
      const updatedMenu = menu.filter(item => item.id !== id);
      setMenu(updatedMenu);
      localStorage.setItem('dailyMenu', JSON.stringify(updatedMenu));
      toast.success('Item removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleImageUpload = (url: string) => {
    setNewItem(prev => ({ ...prev, image: url }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary-900">Daily Menu Management</h2>
      
      <div className="space-y-6">
        <form onSubmit={handleAddItem} className="bg-beige-50 p-4 rounded-lg border border-beige-200">
          <h3 className="text-lg font-semibold mb-4 text-primary-800">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              className="p-2 border rounded"
              value={newItem.name}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="p-2 border rounded"
              value={newItem.price}
              onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))}
              required
              step="0.01"
              min="0"
            />
            <div className="md:col-span-2">
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={newItem.image}
              />
            </div>
            <textarea
              placeholder="Description"
              className="p-2 border rounded md:col-span-2"
              value={newItem.description}
              onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
            <button
              type="submit"
              className="bg-beige-600 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-beige-700 transition-colors md:col-span-2"
            >
              <PlusCircle size={20} />
              Add Item
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-800">Current Menu ({menu.length}/5 items)</h3>
          {menu.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-beige-50 p-4 rounded-lg border border-beige-200">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-semibold text-primary-900">{item.name}</h4>
                <p className="text-primary-700">${item.price.toFixed(2)}</p>
                <p className="text-sm text-primary-600">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="text-primary-600 hover:text-primary-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSaveMenu}
          className="bg-beige-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 hover:bg-beige-700 transition-colors w-full"
        >
          <Save size={20} />
          Save Menu
        </button>
      </div>
    </div>
  );
}