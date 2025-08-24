import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, ApiError } from '../types';
import { useReservation } from './ReservationContext';
import { useNotification } from './NotificationContext';

interface ProductContextType {
  products: Product[];
  activeProducts: Product[];
  isLoadingProducts: boolean;
  productError: ApiError | null;
  fetchProducts: () => Promise<void>;
  updateProductStock: (productId: number, newStock: number) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'status'>) => Promise<Product | null>;
  updateProductStatus: (productId: number, status: 'active' | 'archived') => Promise<void>;
  editProduct: (productId: number, productData: Omit<Product, 'id' | 'status'>) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  restoreProduct: (productId: number) => Promise<void>;
  permanentlyDeleteProduct: (productId: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const API_BASE_URL = '/api';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productError, setProductError] = useState<ApiError | null>(null);

  const { getReservationsByProduct, removeReservationsForProduct } = useReservation();
  const { addNotification } = useNotification();

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin`, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('authToken') && {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          })
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      console.log('Products loaded from MongoDB:', data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeProducts = products.filter(p => p.status === 'active');

  const updateProductStock = useCallback(async (productId: number, newStock: number) => {
    setIsLoadingProducts(true);
    setProductError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: Math.max(0, newStock) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();

      setProducts(prevProducts => {
        const oldProduct = prevProducts.find(p => p.id === productId);
        if (oldProduct && oldProduct.stock <= 0 && updatedProduct.stock > 0) {
          const reservations = getReservationsByProduct(productId);
          if (reservations.length > 0) {
            reservations.forEach(reservation => {
              addNotification({
                userId: reservation.userId,
                message: `Bonne nouvelle ! Le produit "${oldProduct.name}" que vous attendiez est de nouveau en stock.`,
                productId: oldProduct.id,
              });
            });
            removeReservationsForProduct(productId);
          }
        }
        return prevProducts.map(p => 
          p.id === productId ? updatedProduct : p
        );
      });
    } catch (error) {
      console.error('Error updating product stock:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [getReservationsByProduct, addNotification, removeReservationsForProduct]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'status'>) => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newProduct = await response.json();
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
      return null;
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const editProduct = useCallback(async (productId: number, productData: Omit<Product, 'id' | 'status'>) => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error('Error editing product:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const updateProductStatus = useCallback(async (productId: number, status: 'active' | 'archived') => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error('Error updating product status:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: number) => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'deleted' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error('Error soft-deleting product:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const restoreProduct = useCallback(async (productId: number) => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error('Error restoring product:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const permanentlyDeleteProduct = useCallback(async (productId: number) => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/permanent`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      removeReservationsForProduct(productId);
    } catch (error) {
      console.error('Error permanently deleting product:', error);
      setProductError({ 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [removeReservationsForProduct]);

  const value = {
    products,
    activeProducts,
    isLoadingProducts,
    productError,
    fetchProducts,
    updateProductStock,
    addProduct,
    updateProductStatus,
    editProduct,
    deleteProduct,
    restoreProduct,
    permanentlyDeleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};