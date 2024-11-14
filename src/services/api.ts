import axios from 'axios';
import { Product } from '../types/Product';

const API_BASE_URL = 'https://world.openfoodfacts.org';

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cgi/search.pl`, {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        fields: 'code,product_name,image_url,ingredients_text,allergens_tags,nutriments,nova_group,nova_groups,nutriscore_grade,nutrient_levels,product_name_fr,categories_tags,categories',
        page_size: 24,
        sort_by: 'popularity_key',
        lang: 'fr'
      },
    });

    return response.data.products.filter((product: any) => {
      // Normaliser le score NOVA
      if (typeof product.nova_groups === 'number') {
        product.nova_groups = product.nova_groups;
      } else if (typeof product.nova_group === 'number') {
        product.nova_groups = product.nova_group;
      } else if (typeof product.nova_groups === 'string') {
        product.nova_groups = parseInt(product.nova_groups);
      } else if (typeof product.nova_group === 'string') {
        product.nova_groups = parseInt(product.nova_group);
      }

      return product.code && 
        (product.product_name || product.product_name_fr) &&
        (product.product_name?.toLowerCase().includes(query.toLowerCase()) ||
         product.product_name_fr?.toLowerCase().includes(query.toLowerCase()));
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v2/product/${barcode}`, {
      params: {
        fields: 'code,product_name,image_url,ingredients_text,allergens_tags,nutriments,nova_group,nova_groups,nutriscore_grade,nutrient_levels,product_name_fr,categories_tags,categories'
      }
    });
    
    if (response.data.status === 1) {
      const product = response.data.product;
      
      // Normaliser le score NOVA
      if (typeof product.nova_groups === 'number') {
        product.nova_groups = product.nova_groups;
      } else if (typeof product.nova_group === 'number') {
        product.nova_groups = product.nova_group;
      } else if (typeof product.nova_groups === 'string') {
        product.nova_groups = parseInt(product.nova_groups);
      } else if (typeof product.nova_group === 'string') {
        product.nova_groups = parseInt(product.nova_group);
      }
      
      return product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};