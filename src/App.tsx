import React, { useState } from 'react';
import { Baby, AlertTriangle, Info } from 'lucide-react';
import { useQuery } from 'react-query';
import { ProductSearchBar } from './components/ProductSearchBar';
import { BarcodeSearchBar } from './components/BarcodeSearchBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { SearchHistory } from './components/SearchHistory';
import { BubbleBackground } from './components/BubbleBackground';
import { useSearchHistory } from './hooks/useSearchHistory';
import { searchProducts, getProductByBarcode } from './services/api';
import { analyzeProductForPregnancy } from './utils/pregnancyRules';
import { Product } from './types/Product';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory();

  const searchQuery = useQuery<Product[]>(
    ['products', searchTerm],
    () => searchProducts(searchTerm).then(products => 
      products.map(analyzeProductForPregnancy)
    ),
    {
      enabled: !!searchTerm && !scannedBarcode
    }
  );

  const barcodeQuery = useQuery<Product | null>(
    ['product', scannedBarcode],
    () => getProductByBarcode(scannedBarcode!).then(product => 
      product ? analyzeProductForPregnancy(product) : null
    ),
    {
      enabled: !!scannedBarcode,
      onSuccess: (data) => {
        if (data) {
          addToHistory(data);
        }
      }
    }
  );

  const handleSearch = (query: string) => {
    setScannedBarcode(null);
    setSearchTerm(query);
  };

  const handleBarcodeScan = (barcode: string) => {
    setSearchTerm('');
    setScannedBarcode(barcode);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    addToHistory(product);
  };

  const handleHistoryProductSelect = (code: string) => {
    handleBarcodeScan(code);
  };

  const isLoading = searchQuery.isLoading || barcodeQuery.isLoading;
  const isError = searchQuery.isError || barcodeQuery.isError;

  const products = scannedBarcode
    ? (barcodeQuery.data ? [barcodeQuery.data] : [])
    : (searchQuery.data || []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white relative">
      <BubbleBackground />
      
      <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
        <AlertTriangle size={16} className="shrink-0" />
        <p>
          Version Alpha - Développé par Audric pour Abi &lt;3 . Ne pas partager sans autorisation préalable.
        </p>
      </div>

      <header className="bg-white/80 backdrop-blur-sm shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Baby className="text-pink-500" size={32} />
              <h1 className="text-2xl font-semibold text-gray-800">
                Nutri Mom
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vérifiez que les produits alimentaires sont compatibles avec votre grossesse
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recherchez des produits par nom ou scannez leur code-barres
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Info size={24} className="text-blue-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Le Score NOVA, qu'est-ce que c'est ?</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold text-[#198754]">NOVA 1</span> : Aliments non transformés ou minimalement transformés</p>
                <p><span className="font-semibold text-[#85BB2F]">NOVA 2</span> : Ingrédients culinaires transformés</p>
                <p><span className="font-semibold text-[#E49E3D]">NOVA 3</span> : Aliments transformés</p>
                <p><span className="font-semibold text-[#E63E11]">NOVA 4</span> : Produits alimentaires et boissons ultra-transformés</p>
                <p className="text-sm italic mt-2">Plus le score NOVA est élevé, plus le produit est transformé. Les produits NOVA 4 sont déconseillés pendant la grossesse.</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Utilisation du scanner</h3>
              <p className="text-gray-600">Pour un fonctionnement optimal du scanner sur mobile :</p>
              <ol className="list-decimal list-inside mt-2 text-gray-600 space-y-1">
                <li>Ouvrez le scanner une première fois</li>
                <li>Fermez-le</li>
                <li>Réouvrez-le pour accéder aux contrôles de zoom et de changement de caméra</li>
                <li>Double-tapez l'écran pour changer de caméra</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Recherche par nom</h3>
            <ProductSearchBar onSearch={handleSearch} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Recherche par code-barres</h3>
            <BarcodeSearchBar onBarcodeScan={handleBarcodeScan} />
          </div>
        </div>

        <SearchHistory
          history={history}
          onSelectProduct={handleHistoryProductSelect}
          onClearHistory={clearHistory}
          onRemoveItem={removeFromHistory}
        />

        <div className="mt-12">
          {isLoading && (
            <div className="text-center text-gray-600">
              Recherche en cours...
            </div>
          )}

          {isError && (
            <div className="text-center text-red-600">
              Une erreur est survenue lors de la recherche.
            </div>
          )}

          {!searchTerm && !scannedBarcode && !isLoading && (
            <div className="text-center text-gray-600">
              Utilisez l'une des barres de recherche ci-dessus pour commencer
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.code} 
                product={product} 
                onClick={() => handleProductSelect(product)}
              />
            ))}
          </div>

          {(searchTerm || scannedBarcode) && !isLoading && products.length === 0 && (
            <div className="text-center text-gray-600">
              Aucun produit trouvé
            </div>
          )}
        </div>
      </main>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;