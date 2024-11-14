import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';

interface BarcodeSearchBarProps {
  onBarcodeScan: (barcode: string) => void;
}

export const BarcodeSearchBar: React.FC<BarcodeSearchBarProps> = ({ onBarcodeScan }) => {
  const [barcode, setBarcode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onBarcodeScan(barcode.trim());
    }
  };

  const handleBarcodeScan = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    onBarcodeScan(scannedBarcode);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Entrer ou scanner un code-barres..."
            className="w-full px-4 py-3 rounded-full border-2 border-blue-100 focus:border-blue-300 focus:outline-none text-lg placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="absolute right-4 p-2 text-blue-500 hover:text-blue-600"
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