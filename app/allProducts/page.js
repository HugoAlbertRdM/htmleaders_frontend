"use client";

import React, { useEffect, useState } from 'react';
import styles from "./AllProducts.module.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categoriesDict, setCategoriesDict] = useState([]);
  const [strCategories, setStrCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceLimit, setPriceLimit] = useState(1000);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://htmleaders-backend.onrender.com/api/auctions/categories/", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener las categorías");

        const data = await response.json();
        const categoriesDict = data.results;
        setCategoriesDict(categoriesDict);
        setStrCategories(["all", ...new Set(categoriesDict.map(c => c.name))]);
      } catch (error) {
        console.error("Error al obtener los datos de las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://htmleaders-backend.onrender.com/api/auctions/", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener los productos");

        const data = await response.json();
        setProducts(data.results);

        if (data.results.length > 0) {
          const maxProductPrice = Math.max(...data.results.map(p => p.price));
          setPriceLimit(maxProductPrice);
          setMaxPrice(maxProductPrice);
        }
      } catch (error) {
        console.error("Error al obtener los datos de los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoriesDict.length === 0) return;

    const fetchFilteredProducts = async () => {
      try {
        let url = `https://htmleaders-backend.onrender.com/api/auctions/?min=${minPrice}&max=${maxPrice}`;

        if (selectedCategory !== "all") {
          const category = categoriesDict.find(category => category.name === selectedCategory);
          if (category) {
            url += `&category=${category.id}`;
          }
        }

        if (searchText && searchText.length >= 3) {
          url += `&search=${searchText}`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener los productos filtrados");

        const data = await response.json();
        setProducts(data.results);
      } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, minPrice, maxPrice, categoriesDict, searchText]);

  const handleProductClick = (id) => {
    window.location.href = `productDetail/${id}`;
  };

  return (
    <div className={styles.productsContainer}>
      <div className={styles.filters}>
        <span>Search</span>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by title or description"
        />

        <span>Category</span>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {strCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

        <span>Price Range: ${minPrice} - ${maxPrice}</span>
        <div className={styles.priceRange}>
          <input
            type="range"
            min="0"
            max={priceLimit}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <input
            type="range"
            min="0"
            max={priceLimit}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

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
