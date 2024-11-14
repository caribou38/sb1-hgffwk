export interface Product {
  code: string;
  product_name: string;
  product_name_fr?: string;
  image_url: string;
  ingredients_text: string;
  allergens_tags: string[];
  nutriments: {
    [key: string]: number;
  };
  nova_groups?: number;
  nutriscore_grade?: string;
  nutrient_levels?: {
    [key: string]: string;
  };
  categories_tags?: string[];
  categories?: string;
  // Statuts de grossesse
  pregnancy_status?: 'authorized' | 'not_recommended' | 'forbidden';
  pregnancy_reason?: string;
  dangerous_ingredients?: {
    name: string;
    reason: string;
  }[];
}