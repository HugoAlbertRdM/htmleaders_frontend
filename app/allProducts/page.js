"use client";

import React, { useEffect, useState } from 'react';
import styles from "./AllProducts.module.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(response => response.json())
      .then(data => {
        setProducts(data.products); // Almacenamos los productos en el estado
      })
      .catch(error => console.error("Error al obtener los datos del producto:", error));
  }, []);

  const handleProductClick = (id) => {
    window.location.href = `productDetail/${id}`; // Redirige a la página con el id del producto
  };

  return (
    <div className={styles.productsContainer}>
      <div id="products-container" className={styles.productsGrid}>
        {products.map((product) => (
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
