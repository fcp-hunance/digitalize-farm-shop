import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    { id: 1, name: "Äpfel", bestand: 120, einheit: "kg" },
    { id: 2, name: "Kartoffeln", bestand: 200, einheit: "kg" },
    { id: 3, name: "Milch", bestand: 50, einheit: "l" },
    { id: 4, name: "Brot", bestand: 80, einheit: "Stück" },
  ]);

  const addProduct = (newProduct) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productWithId = { ...newProduct, id: newId };
    setProducts([...products, productWithId]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };
  
  const updateProduct = (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);