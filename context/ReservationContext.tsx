
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Reservation } from '../types';
import { useAuth } from './AuthContext'; // Assuming AuthContext provides the current user ID

interface ReservationContextType {
  reservations: Reservation[];
  isLoadingReservations: boolean;
  reservationError: Error | string | null;
  addReservation: (productId: number, userId: number) => void;
  hasUserReserved: (productId: number, userId: number) => boolean;
  getReservationsByProduct: (productId: number) => Reservation[];
  removeReservationsForProduct: (productId: number) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [reservationError, setReservationError] = useState<Error | string | null>(null);

  const addReservation = useCallback((productId: number, userId: number) => {
    setReservationError(null);
    try {
      setReservations(prev => {
        // Check if reservation already exists
        const alreadyReserved = prev.some(res => res.productId === productId && res.userId === userId);
        if (alreadyReserved) {
          return prev;
        }
        
        const newReservation: Reservation = {
          productId,
          userId,
          date: new Date().toISOString(),
        };
        return [...prev, newReservation];
      });
    } catch (error: any) {
      setReservationError(error);
      console.error("Error adding reservation:", error);
    }
  }
  )

  const hasUserReserved = useCallback((productId: number, userId: number): boolean => {
    return reservations.some(res => res.productId === productId && res.userId === userId);
  }, [reservations]);
    
  const getReservationsByProduct = useCallback((productId: number): Reservation[] => {
    return reservations.filter(res => res.productId === productId);
  }, [reservations]);

  const removeReservationsForProduct = useCallback((productId: number) => {
    setReservationError(null);
    try {
      setReservations(prev => prev.filter(res => res.productId !== productId));
    } catch (error: any) {
      setReservationError(error);
      console.error("Error removing reservations for product:", error);
    }
  }, []);

  const value = useMemo(() => ({ 
    reservations,
    isLoadingReservations,
    reservationError,
    addReservation,
    hasUserReserved,
    getReservationsByProduct,
    removeReservationsForProduct,
  }), [
    reservations,
    isLoadingReservations,
    reservationError,
    addReservation,
    hasUserReserved,
    getReservationsByProduct,
    removeReservationsForProduct,
  ]);

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
