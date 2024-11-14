import { Product } from '../types/Product';

const FORBIDDEN_INGREDIENTS = [
  'alcool', 'viande crue', 'pâté', 'lait non pasteurisé', 'fromage non pasteurisé',
  'oeuf cru', 'requin', 'espadon', 'marlin', 'lamproie', 'sushi',
  'luzerne', 'trèfle', 'radis', 'haricot mungo'
];

const DISCOURAGED_INGREDIENTS = [
  'caféine', 'thé'
];

const SEAFOOD_CATEGORIES = [
  'seafood', 'sea-food', 'sea food', 'seafoods', 'sea-foods', 'sea foods',
  'produits de la mer', 'produit de la mer'
];

const SMOKED_FISH_CATEGORIES = [
  'smoked fishes', 'poissons fumés', 'poisson fumé', 'smoked fish'
];

const getNovaGroup = (product: Product): number | undefined => {
  if (typeof product.nova_groups === 'number' && product.nova_groups >= 1 && product.nova_groups <= 4) {
    return product.nova_groups;
  }
  
  if (typeof product.nova_groups === 'string') {
    const parsed = parseInt(product.nova_groups);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 4) {
      return parsed;
    }
  }

  return undefined;
};

const isSeafoodProduct = (product: Product): boolean => {
  const categories = (product.categories_tags || []).map(cat => cat.toLowerCase());
  return SEAFOOD_CATEGORIES.some(term => categories.some(cat => cat.includes(term)));
};

const isSmokedFish = (product: Product): boolean => {
  const categories = (product.categories_tags || []).map(cat => cat.toLowerCase());
  return SMOKED_FISH_CATEGORIES.some(term => categories.some(cat => cat.includes(term)));
};

export const analyzeProductForPregnancy = (product: Product): Product => {
  const ingredients = (product.ingredients_text || '').toLowerCase();
  const novaGroup = getNovaGroup(product);
  const dangerousIngredients: { name: string; reason: string; }[] = [];

  // Règle 1: Produits de la mer fumés
  if (isSmokedFish(product)) {
    return {
      ...product,
      pregnancy_status: 'forbidden',
      pregnancy_reason: 'Les poissons fumés sont interdits pendant la grossesse en raison des risques de listériose.',
      dangerous_ingredients: [{
        name: 'Poisson fumé',
        reason: 'Les poissons fumés présentent un risque de contamination par la listéria.'
      }]
    };
  }

  // Règle 2: Produits de la mer
  if (isSeafoodProduct(product)) {
    if (novaGroup === 1) {
      return {
        ...product,
        pregnancy_status: 'forbidden',
        pregnancy_reason: 'Ce produit de la mer doit être bien cuit avant consommation.',
        dangerous_ingredients: [{
          name: 'Produit de la mer cru',
          reason: 'Les produits de la mer crus peuvent contenir des bactéries dangereuses.'
        }]
      };
    }
  }

  // Règle 3: Ingrédients interdits
  const forbiddenFound = FORBIDDEN_INGREDIENTS.some(ingredient => {
    if (ingredients.includes(ingredient)) {
      dangerousIngredients.push({
        name: ingredient,
        reason: 'Cet ingrédient est interdit pendant la grossesse.'
      });
      return true;
    }
    return false;
  });

  if (forbiddenFound) {
    return {
      ...product,
      pregnancy_status: 'forbidden',
      pregnancy_reason: 'Ce produit contient des ingrédients interdits pendant la grossesse.',
      dangerous_ingredients: dangerousIngredients
    };
  }

  // Règle 4: Score NOVA 4 ou non disponible
  if (novaGroup === 4 || novaGroup === undefined) {
    return {
      ...product,
      pregnancy_status: 'not_recommended',
      pregnancy_reason: novaGroup === 4 ? 
        'Ce produit est ultra-transformé.' : 
        'Le degré de transformation de ce produit est inconnu.',
      dangerous_ingredients: [{
        name: novaGroup === 4 ? 'Produit ultra-transformé' : 'Degré de transformation inconnu',
        reason: novaGroup === 4 ?
          'Les produits ultra-transformés contiennent souvent des additifs à éviter pendant la grossesse.' :
          'Sans information sur le degré de transformation, nous recommandons la prudence pendant la grossesse.'
      }]
    };
  }

  // Règle 5: Ingrédients déconseillés
  const discouragedFound = DISCOURAGED_INGREDIENTS.some(ingredient => {
    if (ingredients.includes(ingredient)) {
      dangerousIngredients.push({
        name: ingredient,
        reason: 'Cet ingrédient est déconseillé pendant la grossesse.'
      });
      return true;
    }
    return false;
  });

  if (discouragedFound) {
    return {
      ...product,
      pregnancy_status: 'not_recommended',
      pregnancy_reason: 'Ce produit contient des ingrédients déconseillés pendant la grossesse.',
      dangerous_ingredients: dangerousIngredients
    };
  }

  // Par défaut: Produit autorisé
  return {
    ...product,
    pregnancy_status: 'authorized',
    pregnancy_reason: 'Ce produit ne présente pas de contre-indication particulière pendant la grossesse.',
    dangerous_ingredients: []
  };
};