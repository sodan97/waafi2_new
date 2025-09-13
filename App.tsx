
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import ProductDetailPage from './components/ProductDetailPage';
import { Product } from './types';
import HeroCarousel from './components/HeroCarousel';
import CategoryList from './components/CategoryList';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPage from './components/AdminPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import NotificationOptionsModal from './components/NotificationOptionsModal';
import { useAuth } from './context/AuthContext';
import { useReservation } from './context/ReservationContext';
import NavigationControls from './components/NavigationControls';

export type View = 'products' | 'cart' | 'login' | 'register' | 'admin' | 'orders';

interface HistoryState {
  view: View;
  selectedCategory: string | null;
}

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([{ view: 'products', selectedCategory: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [notificationOptionsProduct, setNotificationOptionsProduct] = useState<Product | null>(null);
  const [pendingReservationProductId, setPendingReservationProductId] = useState<number | null>(null);
  
  const { currentUser } = useAuth();
  const reservationContext = useReservation();
  const prevUserRef = useRef(currentUser);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (!prevUser && currentUser) {
      // On login, reset history
      const initialView = currentUser.role === 'admin' ? 'admin' : 'products';
      const initialHistoryState: HistoryState = { view: initialView, selectedCategory: null };
      setHistory([initialHistoryState]);
      setHistoryIndex(0);

      if (pendingReservationProductId) {
        reservationContext.addReservation(pendingReservationProductId, currentUser.id);
        setPendingReservationProductId(null);
      }
    } else if (prevUser && !currentUser) {
      // On logout, reset history
      const initialHistoryState: HistoryState = { view: 'products', selectedCategory: null };
      setHistory([initialHistoryState]);
      setHistoryIndex(0);
    }
    prevUserRef.current = currentUser;
  }, [currentUser, pendingReservationProductId, reservationContext]);

  const { view, selectedCategory } = history[historyIndex] || { view: 'products', selectedCategory: null };

  const navigate = (location: HistoryState) => {
    const currentLocation = history[historyIndex];
    if (location.view === currentLocation.view && location.selectedCategory === currentLocation.selectedCategory) {
      return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(location);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const setView = (view: View) => {
    setSelectedProductId(null); // Fix: Always clear product detail view when changing main view
    navigate({ view, selectedCategory: null });
  };

  const handleSelectCategory = (category: string) => {
    navigate({ view: 'products', selectedCategory: category });
  };
  
  const handleLogoClick = () => {
    setSelectedProductId(null);
     if (currentUser?.role === 'admin') {
      navigate({ view: 'admin', selectedCategory: null });
    } else {
      navigate({ view: 'products', selectedCategory: null });
    }
  };

  const navigateToProductPage = (id: number) => {
    setSelectedProductId(id);
  };
  
  const handleContinueShopping = () => {
    navigate({ view: 'products', selectedCategory: null });
  };

  const renderContent = () => {
    if (selectedProductId) {
      return <ProductDetailPage productId={selectedProductId} onBack={() => setSelectedProductId(null)} navigateToProductPage={navigateToProductPage} />;
    }

    switch(view) {
      case 'login':
        return <LoginPage setView={setView} />;
      case 'register':
        return <RegisterPage setView={setView} />;
      case 'admin':
        return currentUser?.role === 'admin' ? <AdminPage /> : <p>Accès non autorisé.</p>;
      case 'orders':
        return currentUser ? <OrderHistoryPage /> : <LoginPage setView={setView} />;
      case 'cart':
        if (currentUser?.role === 'admin') {
            return <p className="text-center text-xl">L'accès au panier est réservé aux clients.</p>;
        }
        return <CartView onContinueShopping={handleContinueShopping} />;
      case 'products':
      default:
        if (currentUser?.role === 'admin') {
            return <AdminPage />;
        }
        if (selectedCategory) {
          return <ProductList category={selectedCategory} onProductSelect={navigateToProductPage} onNotifyMeClick={setNotificationOptionsProduct} />;
        }
        return (
          <>
            <HeroCarousel />
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 py-16 rounded-2xl mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Pourquoi choisir Wafi ?</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Nous vous offrons une expérience d'achat exceptionnelle avec des produits de qualité et un service client irréprochable</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="text-center p-6">
                  <div className="bg-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Qualité Garantie</h3>
                  <p className="text-gray-600">Tous nos produits sont soigneusement sélectionnés pour leur qualité exceptionnelle</p>
                </div>
                <div className="text-center p-6">
                  <div className="bg-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Livraison Rapide</h3>
                  <p className="text-gray-600">Commandez aujourd'hui et recevez vos produits rapidement partout au Sénégal</p>
                </div>
                <div className="text-center p-6">
                  <div className="bg-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Support WhatsApp</h3>
                  <p className="text-gray-600">Contactez-nous facilement via WhatsApp pour toute question ou commande</p>
                </div>
              </div>
            </div>
            <CategoryList onSelectCategory={handleSelectCategory} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header setView={setView} onLogoClick={handleLogoClick} navigateToProductPage={navigateToProductPage} />
      <main className="container mx-auto px-4 py-8">
        {!selectedProductId && (
             <NavigationControls
                onBack={goBack}
                onForward={goForward}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
             />
        )}
        {renderContent()}
      </main>
      <footer className="text-center py-6 bg-white border-t mt-12">
          <p className="text-gray-500">&copy; 2025 Wafi. Tous droits réservés.</p>
      </footer>
      {notificationOptionsProduct && (
        <NotificationOptionsModal
          product={notificationOptionsProduct}
          onClose={() => setNotificationOptionsProduct(null)}
          setView={setView}
          setPendingReservation={setPendingReservationProductId}
        />
      )}
    </div>
  );
};

export default App;