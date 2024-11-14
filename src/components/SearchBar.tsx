import React, { useState } from 'react';
import { Search, Camera } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onBarcodeScan: (barcode: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onBarcodeScan }) => {
  const [query, setQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleBarcodeScan = (barcode: string) => {
    onBarcodeScan(barcode);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full px-4 py-3 rounded-full border-2 border-pink-100 focus:border-pink-300 focus:outline-none text-lg placeholder-gray-400"
          />
          <button
            type="submit"
            className="absolute right-16 p-2 text-pink-500 hover:text-pink-600"
          >
            <Search size={24} />
          </button>
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="absolute right-4 p-2 text-pink-500 hover:text-pink-600"
          >
            <Camera size={24} />
          </button>
        </div>
      </form>

      {isScannerOpen && (
        <BarcodeScanner
          onResult={handleBarcodeScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </>
  );
};