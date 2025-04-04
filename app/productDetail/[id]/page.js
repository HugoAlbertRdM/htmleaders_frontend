"use client"; // No es necesario con App Directory, solo es necesario en componentes de cliente
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import styles from './ProductDetail.module.css';

const ProductDetail = ({ params }) => {
  const { id } = React.use(params);  // Accedemos al `id` desde params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesDict, setCategoriesDict] = useState([]);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [userData, setUserData] = useState(null);
  const [editBid, setEditBid] = useState(null); // Para manejar la puja que se está editando
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://das-p2-backend.onrender.com/api/users/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener los datos del usuario");
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("accessToken"); // Borra el token si falla la autenticación
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  
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

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/`)
      .then(response => response.json())
      .then(data => {
        const bids = data.results;
        setBids(bids);
      })
      .catch(error => console.error("Error al obtener los datos de las categorias:", error));
  }, []);

  const handleBid = () => {
    if (bidAmount && !isNaN(bidAmount)) {
      fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: bidAmount, auction: id, bidder: userData.username }), // Enviar la cantidad de la puja
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.id) {
            setBids(prevBids => [...prevBids, data]); // Actualiza la lista de pujas
            setBidAmount(""); // Limpiar el input después de la puja
          } else {
            console.error(`Error: No se ha recibido una puja válida. price: ${bidAmount}, bidder: ${userData.username}, auction: ${product}`);
          }
        })
        .catch(error => console.error("Error al realizar la puja:", error));
    } else {
      alert("Please enter a valid bid amount.");
    }
  };

  // Función para editar una puja
  const handleEditBid = (bid) => {
    setEditBid(bid);
    setBidAmount(bid.price); // Rellenar el campo con la puja a editar
  };

  // Función para actualizar la puja
  const handleUpdateBid = () => {
    if (editBid && bidAmount && !isNaN(bidAmount)) {
      console.log("Updating bid:", editBid.id, bidAmount); // Verificación en consola
      fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/${editBid.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: bidAmount }), // Actualizar la cantidad de la puja
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.id) {
            console.log("Updated bid:", data); // Verificación en consola
            // Actualizamos el estado de las pujas
            setBids(prevBids => prevBids.map(bid => (bid.id === data.id ? data : bid))); // Reemplazamos la puja editada
            setBidAmount(""); // Limpiar el input
            setEditBid(null); // Desactivar el modo de edición
          }
        })
        .catch(error => console.error("Error al actualizar la puja:", error));
    }
  };

  // Función para eliminar una puja
  const handleDeleteBid = (bidId) => {
    fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/${bidId}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setBids(prevBids => prevBids.filter(bid => bid.id !== bidId)); // Elimina la puja de la lista
      })
      .catch(error => console.error("Error al eliminar la puja:", error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <p>Loading...</p>;
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

          <div className={styles.bidsSection}>
            <h3>Bids</h3>
            {bids.length > 0 ? (
              <ul className={styles.bidsList}>
                {bids.map((bid, index) => (
                  <li key={index} className={styles.bidItem}>
                    <strong>User:</strong> {bid.bidder} | <strong>Amount:</strong> ${bid.price} | <strong>Date:</strong> {new Date(bid.creation_date).toLocaleString()}
                    <button onClick={() => handleEditBid(bid)}>Edit</button>
                    <button onClick={() => handleDeleteBid(bid.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bids available.</p>
            )}

            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className={styles.bidInput}
            />
            <button className={styles.bidButton} onClick={editBid ? handleUpdateBid : handleBid}>
              {editBid ? "Update Bid" : "Place Bid"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProductDetail;
