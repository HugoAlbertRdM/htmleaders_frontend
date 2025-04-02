"use client"; // No es necesario con App Directory, solo es necesario en componentes de cliente
import React, { useEffect, useState } from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ params }) => {
  const { id } = React.use(params);  // Accedemos al `id` desde params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesDict, setCategoriesDict] = useState([]);

  // Verificamos que `id` esté siendo pasado correctamente
  useEffect(() => {
    console.log('Product ID:', id); // Verifica si el id llega correctamente
    if (id) {
      fetch(`http://127.0.0.1:8000/api/auctions/${id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product details:", err);
          setError("Error fetching product details.");
          setLoading(false);
        });
    } else {
      setError("Invalid product ID.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/categories/")
      .then(response => response.json())
      .then(data => {
        const categoriesDict = data.results;
        setCategoriesDict(categoriesDict);
      })
      .catch(error => console.error("Error al obtener los datos de las categorias:", error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.productDetailContainer}>
      {product && (
        <div className={styles.productDetail}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.productImage}
          />
          <div className={styles.productInfo}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p><strong>Price: </strong>${product.price}</p>
            <p><strong>Category: </strong>
              {categoriesDict.length > 0 
                ? categoriesDict.find(cat => Number(cat.id) === Number(product.category))?.name || "Unknown" 
                : "Loading categories..."}
            </p>
            <p><strong>Stock: </strong>{product.stock}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
