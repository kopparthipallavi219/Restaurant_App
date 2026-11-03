'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  menuItemId: string;
  title: string;
  categorySlug: string;
  portionName: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedOutlet: string;
  setSelectedOutlet: (outlet: string) => void;
  orderType: 'Delivery' | 'Pickup';
  setOrderType: (type: 'Delivery' | 'Pickup') => void;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('narayanguda');
  const [orderType, setOrderType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mehfil_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (_e) {}
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mehfil_cart', JSON.stringify(items));
    } catch (_e) {}
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const itemId = `${newItem.menuItemId}-${newItem.portionName}`;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevItems, { ...newItem, id: itemId }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MEHFIL10' || clean === 'NIZAMI10') {
      setCouponCode(clean);
      setDiscountPercent(0.1); // 10% discount
      return true;
    }
    return false;
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountPercent);
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const deliveryFee = orderType === 'Delivery' && subtotal > 0 && subtotal < 500 ? 40 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount + deliveryFee);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        selectedOutlet,
        setSelectedOutlet,
        orderType,
        setOrderType,
        couponCode,
        applyCoupon,
        discountAmount,
        subtotal,
        taxAmount,
        deliveryFee,
        totalAmount,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
