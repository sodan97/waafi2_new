import Product from '../models/Product.js';
import { PRODUCTS } from '../constants/products.js';

export const initializeDatabase = async () => {
  try {
    console.log('🔍 Vérification des produits existants...');
    
    // Vérifier si des produits existent déjà
    const existingProductsCount = await Product.countDocuments();
    console.log(`📊 Produits existants: ${existingProductsCount}`);
    
    if (existingProductsCount === 0) {
      console.log('📦 Aucun produit trouvé. Initialisation avec les produits par défaut...');
      
      // Insérer les produits par défaut
      const insertedProducts = await Product.insertMany(PRODUCTS);
      console.log(`✅ ${insertedProducts.length} produits ajoutés avec succès !`);
      
      // Afficher les produits ajoutés
      insertedProducts.forEach(product => {
        console.log(`   - ${product.name} (ID: ${product.id})`);
      });
    } else {
      console.log('✅ Base de données déjà initialisée avec des produits.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};