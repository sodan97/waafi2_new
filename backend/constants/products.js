export const PRODUCTS = [
  // Produits de Beauté
  {
    id: 12,
    name: "Crème Anti-Âge 'Éternelle Jeunesse'",
    price: 45000,
    imageUrls: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=2574&auto=format&fit=crop"],
    description: "Une crème révolutionnaire qui combat les signes du vieillissement avec des ingrédients naturels premium.",
    category: "Produits de Beauté",
    stock: 18,
    status: 'active'
  },
  {
    id: 13,
    name: "Masque Hydratant 'Oasis'",
    price: 25000,
    imageUrls: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2574&auto=format&fit=crop"],
    description: "Un masque intensément hydratant qui redonne éclat et souplesse à votre peau en 15 minutes.",
    category: "Produits de Beauté",
    stock: 30,
    status: 'active'
  },
  {
    id: 14,
    name: "Fond de Teint 'Perfection Naturelle'",
    price: 32000,
    imageUrls: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2574&auto=format&fit=crop"],
    description: "Un fond de teint longue tenue qui s'adapte parfaitement à votre carnation pour un teint unifié.",
    category: "Produits de Beauté",
    stock: 25,
    status: 'active'
  },
  {
    id: 15,
    name: "Palette Ombres à Paupières 'Sunset Dreams'",
    price: 28000,
    imageUrls: ["https://images.unsplash.com/photo-1583241800698-9c2e8b2b9e8b?q=80&w=2574&auto=format&fit=crop"],
    description: "12 teintes chaudes et vibrantes pour créer des looks de jour comme de soirée.",
    category: "Produits de Beauté",
    stock: 20,
    status: 'active'
  },
  // Électronique (nouveaux produits)
  {
    id: 16,
    name: "Smartphone 'TechPro Max'",
    price: 350000,
    imageUrls: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2574&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=2574&auto=format&fit=crop"
    ],
    description: "Le dernier smartphone avec écran OLED 6.7', triple caméra 108MP et batterie longue durée.",
    category: "Électronique",
    stock: 8,
    status: 'active'
  },
  {
    id: 17,
    name: "Tablette 'CreativeTab Pro'",
    price: 280000,
    imageUrls: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2574&auto=format&fit=crop"],
    description: "Tablette haute performance avec écran 12.9' et stylet inclus, parfaite pour le travail et la créativité.",
    category: "Électronique",
    stock: 12,
    status: 'active'
  },
  {
    id: 18,
    name: "Casque Gaming 'SoundWave Elite'",
    price: 75000,
    imageUrls: ["https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=2574&auto=format&fit=crop"],
    description: "Casque gaming professionnel avec son surround 7.1 et microphone anti-bruit intégré.",
    category: "Électronique",
    stock: 15,
    status: 'active'
  },
  {
    id: 19,
    name: "Chargeur Sans Fil 'PowerPad Ultra'",
    price: 35000,
    imageUrls: ["https://images.unsplash.com/photo-1609592806596-4d1b5e5e0e0e?q=80&w=2574&auto=format&fit=crop"],
    description: "Station de charge sans fil rapide compatible avec tous les appareils Qi, design élégant.",
    category: "Électronique",
    stock: 25,
    status: 'active'
  },
  {
    id: 1,
    name: "Parfum 'Fleur de Nuit'",
    price: 35000,
    imageUrls: [
      
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1887&auto=format&fit=crop"
    ],
    description: "Une fragrance envoûtante et mystérieuse, mêlant jasmin, ambre et notes boisées. Parfait pour les soirées où vous voulez laisser une impression mémorable.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 15,
    status: 'active'
  },
  {
    id: 2,
    name: "Sérum Éclat 'Or Liquide'",
    price: 22000,
    imageUrls: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop"],
    description: "Un sérum visage revitalisant enrichi en vitamines pour une peau lumineuse.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 25,
    status: 'active'
  },
  {
    id: 3,
    name: "Crème Mains 'Douceur de Karité'",
    price: 8500,
    imageUrls: ["https://images.unsplash.com/photo-1629198725902-ad28635fedeb?q=80&w=1887&auto=format&fit=crop"],
    description: "Crème nourrissante au beurre de karité pur pour des mains douces et protégées.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 50,
    status: 'active'
  },
  {
    id: 4,
    name: "Rouge à Lèvres 'Rouge Passion'",
    price: 12500,
    imageUrls: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1887&auto=format&fit=crop"],
    description: "Un rouge à lèvres mat longue tenue, à la couleur intense et veloutée.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 30,
    status: 'active'
  },
  {
    id: 5,
    name: "Huile Corporelle 'Soleil Scintillant'",
    price: 19000,
    imageUrls: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1887&auto=format&fit=crop"],
    description: "Huile sèche qui nourrit la peau et laisse un voile doré, délicatement parfumé.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 20,
    status: 'active'
  },
  {
    id: 6,
    name: "Mascara Volume 'Regard Intense'",
    price: 11000,
    imageUrls: ["https://images.unsplash.com/photo-1560790671-b765b533af5c?q=80&w=1890&auto=format&fit=crop"],
    description: "Donnez à vos cils un volume spectaculaire et une longueur infinie.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 40,
    status: 'active'
  },
  {
    id: 7,
    name: "Écharpe en Soie 'Jardin d'Hiver'",
    price: 28000,
    imageUrls: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2574&auto=format&fit=crop"],
    description: "Une écharpe en soie pure aux motifs floraux, parfaite pour rehausser n'importe quelle tenue.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 10,
    status: 'active'
  },
  {
    id: 8,
    name: "Sac à Main 'Élégance Parisienne'",
    price: 65000,
    imageUrls: ["https://images.unsplash.com/photo-1590737141399-365d83a83f98?q=80&w=2574&auto=format&fit=crop"],
    description: "Un sac à main en cuir structuré, l'accessoire chic et intemporel par excellence.",
    category: "Produits Cosmétiques & Accessoires",
    stock: 0,
    status: 'active'
  },
  {
    id: 9,
    name: "Montre Connectée 'Chrono-Fit'",
    price: 85000,
    imageUrls: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-35d9addbbfb5?q=80&w=1964&auto=format&fit=crop"
    ],
    description: "Suivez votre activité, recevez vos notifications et restez connecté avec style. Compatible iOS et Android.",
    category: "Électronique",
    stock: 12,
    status: 'active'
  },
  {
    id: 10,
    name: "Écouteurs Sans Fil 'AuraSound'",
    price: 48000,
    imageUrls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop"],
    description: "Un son immersif et une liberté de mouvement totale pour votre musique et vos appels.",
    category: "Électronique",
    stock: 22,
    status: 'active'
  },
  {
    id: 11,
    name: "Enceinte Bluetooth 'Vibra-Sound'",
    price: 32000,
    imageUrls: ["https://images.unsplash.com/photo-1589256469207-8cdf09115723?q=80&w=2670&auto=format&fit=crop"],
    description: "Une enceinte portable puissante pour animer vos journées où que vous soyez.",
    category: "Électronique",
    stock: 18,
    status: 'active'
  }
];