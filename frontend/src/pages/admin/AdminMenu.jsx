import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form data
  const initialForm = {
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Coffee',
    available: true,
    tags: '',
    prepTime: '5-10 min',
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = [
    'Coffee',
    'Tea',
    'Cold Drinks',
    'Breakfast',
    'Snacks',
    'Desserts',
    'Main Course',
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = '/menu?';
      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      const res = await api.get(url);
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [categoryFilter, searchQuery]);

  // Handle Create
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menu', formData);
      toast.success('New menu item created!');
      setIsAddModalOpen(false);
      setFormData(initialForm);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to create item');
    }
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/menu/${editingItem._id}`, formData);
      toast.success('Menu item updated!');
      setEditingItem(null);
      setFormData(initialForm);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to update item');
    }
  };

  // Handle Toggle Availability
  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/menu/${id}/toggle-availability`);
      toast.success(res.data?.message || 'Availability updated');
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle availability');
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await api.delete(`/menu/${deletingItem._id}`);
      toast.success('Menu item removed from catalog');
      setDeletingItem(null);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to delete item');
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      available: item.available,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      prepTime: item.prepTime || '5-10 min',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coffee-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Menu Management
          </h1>
          <p className="text-xs text-cream-300 mt-1">
            Add, update pricing, change category, or toggle item availability in real-time.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(initialForm);
            setIsAddModalOpen(true);
          }}
          className="btn-gold text-xs uppercase px-5 py-2.5 inline-flex items-center space-x-2 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-coffee-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name..."
            className="w-full pl-10 pr-4 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 placeholder-cream-400/50 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === 'All'
                ? 'bg-gold-500 text-coffee-950'
                : 'bg-coffee-900 text-cream-300 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === c
                  ? 'bg-gold-500 text-coffee-950'
                  : 'bg-coffee-900 text-cream-300 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="glass-panel rounded-2xl border border-coffee-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-coffee-900/90 text-cream-400 uppercase tracking-wider text-[10px] border-b border-coffee-800">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-cream-400">
                    Loading menu catalog...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-coffee-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-coffee-950 border border-gold-500/20"
                      />
                      <div>
                        <p className="font-semibold text-cream-100 text-sm">{item.name}</p>
                        <p className="text-cream-400 line-clamp-1 max-w-xs">{item.description}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-coffee-900 text-gold-400 border border-gold-500/20 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-gold-400">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggle(item._id)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          item.available
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        <span>{item.available ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg bg-coffee-900 text-cream-300 hover:text-gold-400 hover:bg-coffee-800 transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 rounded-lg bg-coffee-900 text-cream-300 hover:text-rose-400 hover:bg-coffee-800 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-cream-400">
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isAddModalOpen || !!editingItem}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={editingItem ? handleUpdate : handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Velvet Double Espresso"
                className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="4.50"
                className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Prep Time
              </label>
              <input
                type="text"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                placeholder="5-8 min"
                className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Bestseller, Organic"
                className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tasting notes, bean origin, ingredients, and preparation method..."
              className="w-full px-3.5 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="availableCheck"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="rounded bg-coffee-900 border-coffee-700 text-gold-500 focus:ring-gold-500"
            />
            <label htmlFor="availableCheck" className="text-xs text-cream-200 font-medium">
              Item is actively available in kitchen / espresso bar
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-coffee-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingItem(null);
              }}
              className="px-4 py-2 rounded-xl text-xs text-cream-300 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn-gold text-xs uppercase px-6 py-2.5 font-bold">
              {editingItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 text-rose-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-cream-200">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">{deletingItem?.name}</strong> from the cafe menu catalog?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-coffee-800">
            <button
              onClick={() => setDeletingItem(null)}
              className="px-4 py-2 rounded-xl text-xs text-cream-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-xl text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors"
            >
              Delete Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMenu;
