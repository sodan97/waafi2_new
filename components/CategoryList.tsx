
import React, { useMemo } from 'react';
import { useProduct } from '../context/ProductContext';

interface CategoryListProps {
    onSelectCategory: (category: string) => void;
}

const CategoryCard: React.FC<{ category: { name: string; imageUrl: string }; onClick: () => void }> = ({ category, onClick }) => (
    <div 
        onClick={onClick}
        className="relative rounded-xl overflow-hidden shadow-xl h-64 cursor-pointer group transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500 flex items-end justify-center p-6">
            <div className="text-center transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white text-2xl font-bold mb-2" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{category.name}</h3>
              <div className="w-12 h-1 bg-rose-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
    </div>
);

const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory }) => {
  const { activeProducts } = useProduct();

  const categories = useMemo(() => {
      const categoryMap: Record<string, { name: string; imageUrl: string; productCount: number }> = {};
      const preferredOrder = ["Produits de Beauté", "Électronique", "Produits Cosmétiques & Accessoires"];
      
      activeProducts.forEach(product => {
          if (!categoryMap[product.category]) {
              categoryMap[product.category] = {
                  name: product.category,
                  imageUrl: product.imageUrls[0],
                  productCount: 0
              };
          }
          categoryMap[product.category].productCount++;
      });
      
      const allCategoryNames = Object.keys(categoryMap);
      
      const sortedNames = [...preferredOrder, ...allCategoryNames.filter(c => !preferredOrder.includes(c))];

      return sortedNames
        .map(name => categoryMap[name])
        .filter(Boolean); // Ensure no undefined categories are passed
  }, [activeProducts]);


  return (
    <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos Catégories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Découvrez notre sélection soigneusement choisie de produits de qualité premium</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
                <CategoryCard key={category.name} category={category} onClick={() => onSelectCategory(category.name)} />
            ))}
        </div>
    </div>
  );
};

export default CategoryList;