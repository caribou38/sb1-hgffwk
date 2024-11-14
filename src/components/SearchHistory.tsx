import React from 'react';
import { Clock, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProductStatusBadge } from './ProductStatusBadge';

interface SearchHistoryProps {
  history: Array<{
    id: string;
    timestamp: number;
    product: {
      code: string;
      name: string;
      image_url: string;
      pregnancy_status: string;
      nova_groups?: number;
      nutriscore_grade?: string;
    };
  }>;
  onSelectProduct: (code: string) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectProduct,
  onClearHistory,
  onRemoveItem
}) => {
  if (history.length === 0) return null;

  const getNovaColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    switch (score) {
      case 1: return 'bg-[#198754]';
      case 2: return 'bg-[#85BB2F]';
      case 3: return 'bg-[#E49E3D]';
      case 4: return 'bg-[#E63E11]';
      default: return 'bg-gray-500';
    }
  };

  const getNutriScoreColor = (grade?: string) => {
    if (!grade) return 'bg-gray-500';
    switch (grade.toLowerCase()) {
      case 'a': return 'bg-[#198754]';
      case 'b': return 'bg-[#85BB2F]';
      case 'c': return 'bg-[#E49E3D]';
      case 'd': return 'bg-[#D45B00]';
      case 'e': return 'bg-[#E63E11]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-gray-500" size={20} />
          <h3 className="font-semibold text-gray-800">Produits consultés</h3>
        </div>
        <button
          onClick={onClearHistory}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
        >
          <Trash2 size={16} />
          Effacer l'historique
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
          >
            <button
              onClick={() => onSelectProduct(item.product.code)}
              className="flex items-center gap-4 flex-1 text-left"
            >
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium mb-1">{item.product.name}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.product.nutriscore_grade && (
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getNutriScoreColor(item.product.nutriscore_grade)}`}>
                      Nutriscore {item.product.nutriscore_grade.toUpperCase()}
                    </span>
                  )}
                  {item.product.nova_groups && (
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getNovaColor(item.product.nova_groups)}`}>
                      NOVA {item.product.nova_groups}
                    </span>
                  )}
                </div>
                <ProductStatusBadge status={item.product.pregnancy_status as any} />
                <p className="text-sm text-gray-500 mt-2">
                  {formatDistanceToNow(item.timestamp, { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </p>
              </div>
            </button>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-1 hover:bg-gray-200 rounded-full"
              aria-label="Supprimer de l'historique"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};