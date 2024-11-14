import React from 'react';
import { Product } from '../types/Product';
import { ProductStatusBadge } from './ProductStatusBadge';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const getNovaColor = (score: number) => {
    switch (score) {
      case 1: return 'bg-[#198754]';
      case 2: return 'bg-[#85BB2F]';
      case 3: return 'bg-[#E49E3D]';
      case 4: return 'bg-[#E63E11]';
      default: return 'bg-gray-500';
    }
  };

  const getNutriScoreColor = (grade: string) => {
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
    <div 
      className="rounded-lg shadow-md p-4 bg-white border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <img
          src={product.image_url || 'https://via.placeholder.com/150'}
          alt={product.product_name || 'Product image'}
          className="w-24 h-24 object-cover rounded-md"
        />
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold">{product.product_name || 'Produit sans nom'}</h3>
          <div className="flex flex-wrap gap-2">
            {product.nutriscore_grade && (
              <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getNutriScoreColor(product.nutriscore_grade)}`}>
                Nutriscore {product.nutriscore_grade.toUpperCase()}
              </span>
            )}
            {product.nova_groups && (
              <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getNovaColor(product.nova_groups)}`}>
                NOVA {product.nova_groups}
              </span>
            )}
          </div>
          {product.pregnancy_status && (
            <ProductStatusBadge status={product.pregnancy_status} />
          )}
        </div>
      </div>
    </div>
  );
};