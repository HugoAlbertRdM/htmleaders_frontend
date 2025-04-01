"use client";

import React, { useEffect, useState } from 'react';
import styles from "./AllProducts.module.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceLimit, setPriceLimit] = useState(1000);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setFilteredProducts(data.products);
        const uniqueCategories = ["all", ...new Set(data.products.map(p => p.category))];
        setCategories(uniqueCategories);
        
        const maxProductPrice = Math.max(...data.products.map(p => p.price));
        setPriceLimit(maxProductPrice);
        setMaxPrice(maxProductPrice);
      })
      .catch(error => console.error("Error al obtener los datos del producto:", error));
  }, []);

  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    filtered = filtered.filter(p => p.price <= maxPrice);
    
    setFilteredProducts(filtered);
  }, [selectedCategory, maxPrice, products]);

  const handleProductClick = (id) => {
    window.location.href = `productDetail/${id}`;
  };

  return (
    <div className={styles.productsContainer}>
      <div className={styles.filters}>
        <span>Category</span>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <input
          type="range"
          min="0"
          max={priceLimit}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <span>Max Price: ${maxPrice}</span>
      </div>
      <div id="products-container" className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={styles.productItem}
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className={styles.productImage}
            />
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
