import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ProductSearchBarProps {
  onSearch: (query: string) => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit par nom..."
          className="w-full px-4 py-3 rounded-full border-2 border-pink-100 focus:border-pink-300 focus:outline-none text-lg placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-4 p-2 text-pink-500 hover:text-pink-600"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};