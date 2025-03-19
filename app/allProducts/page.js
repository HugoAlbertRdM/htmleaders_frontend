"use client";

import React, { useEffect, useState } from 'react';

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
    window.location.href = `api.html?id=${id}`; // Redirige a la página con el id del producto
  };

  return (
    <div id="products-container" className="products-grid">
      {products.map((product) => (
        <div
          key={product.id}
          className="product-item"
          onClick={() => handleProductClick(product.id)}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-image"
          />
          <h3>{product.title}</h3>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
