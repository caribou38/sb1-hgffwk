import { useState, useEffect } from 'react';
import { Product } from '../types/Product';

const HISTORY_KEY = 'product_history';
const MAX_HISTORY_ITEMS = 10;

interface HistoryItem {
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
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (product: Product) => {
    setHistory(prevHistory => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        product: {
          code: product.code,
          name: product.product_name,
          image_url: product.image_url,
          pregnancy_status: product.pregnancy_status || 'unknown',
          nova_groups: product.nova_groups,
          nutriscore_grade: product.nutriscore_grade
        }
      };

      // Filtrer les doublons basés sur le code du produit
      const filteredHistory = prevHistory.filter(item => 
        item.product.code !== product.code
      );

      // Ajouter le nouvel élément au début et limiter la taille
      return [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prevHistory => 
      prevHistory.filter(item => item.id !== id)
    );
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};