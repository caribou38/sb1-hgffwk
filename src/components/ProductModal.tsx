import React from 'react';
import { X, AlertCircle, Award, Factory, Tag, Layers, Baby, AlertTriangle } from 'lucide-react';
import { Product } from '../types/Product';
import { ProductStatusBadge } from './ProductStatusBadge';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const novaMap = {
  1: 'Aliments non transformés ou minimalement transformés',
  2: 'Ingrédients culinaires transformés',
  3: 'Aliments transformés',
  4: 'Produits alimentaires et boissons ultra-transformés'
};

const nutriscoreMap = {
  'a': 'Excellent',
  'b': 'Bon',
  'c': 'Moyen',
  'd': 'Médiocre',
  'e': 'Mauvais'
};

const cleanCategory = (category: string): string => {
  return category
    .replace(/^(en|fr):/, '')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const categories = (product.categories_tags || [])
    .map(cleanCategory)
    .filter(Boolean)
    .filter((cat, index, self) => self.indexOf(cat) === index);

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">{product.product_name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-md">
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-green-600" size={20} />
                    <h3 className="font-semibold text-green-800">Nutri-Score</h3>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-white ${
                    product.nutriscore_grade ? getNutriScoreColor(product.nutriscore_grade) : 'bg-gray-500'
                  }`}>
                    {product.nutriscore_grade ? 
                      `${product.nutriscore_grade.toUpperCase()} - ${nutriscoreMap[product.nutriscore_grade as keyof typeof nutriscoreMap]}` : 
                      'Non disponible'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-blue-800">Score NOVA</h3>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-white ${
                    product.nova_groups ? getNovaColor(product.nova_groups) : 'bg-gray-500'
                  }`}>
                    {product.nova_groups ? 
                      `${product.nova_groups} - ${novaMap[product.nova_groups as keyof typeof novaMap]}` : 
                      'Non disponible'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {product.pregnancy_status && (
                <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-6 border border-pink-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Baby className="text-pink-600" size={24} />
                    <h3 className="text-lg font-semibold text-pink-800">Statut pendant la grossesse</h3>
                  </div>
                  <ProductStatusBadge status={product.pregnancy_status} />
                  
                  {product.pregnancy_reason && (
                    <p className="mt-4 text-gray-700">{product.pregnancy_reason}</p>
                  )}
                  
                  {product.dangerous_ingredients && product.dangerous_ingredients.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {product.dangerous_ingredients.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border border-pink-200"
                        >
                          <AlertCircle className="text-pink-500 mt-0.5 shrink-0" size={20} />
                          <div>
                            <span className="font-medium text-pink-900">{item.name}</span>
                            <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {categories.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="text-indigo-600" size={24} />
                    <h3 className="text-lg font-semibold text-indigo-800">Catégories</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 shadow-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="text-purple-600" size={24} />
                  <h3 className="text-lg font-semibold text-purple-800">Ingrédients</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{product.ingredients_text}</p>

                {product.allergens_tags && product.allergens_tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Allergènes</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.allergens_tags.map((allergen, index) => (
                        <span
                          key={`${product.code}-${allergen}-${index}`}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {allergen.replace(/^(en|fr):/, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-amber-500 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Avertissement médical</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Les informations fournies par cette application sont uniquement indicatives et ne remplacent en aucun cas l'avis d'un professionnel de santé. La qualité de nos recommandations dépend des données disponibles dans la base Open Food Facts, qui peuvent être incomplètes ou inexactes. En cas de doute sur la consommation d'un produit pendant votre grossesse, nous vous recommandons vivement de consulter votre médecin ou votre sage-femme.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};