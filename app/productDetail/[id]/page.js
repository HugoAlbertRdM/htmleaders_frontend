"use client"; // No es necesario con App Directory, solo es necesario en componentes de cliente
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import styles from './ProductDetail.module.css';
import Link from 'next/link';

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
  const [errorMessage, setErrorMessage] = useState(null);
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
          "https://htmleaders-backend.onrender.com/api/users/profile/",
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
      fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id}/`)
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
    fetch("https://htmleaders-backend.onrender.com/api/auctions/categories/")
      .then(response => response.json())
      .then(data => {
        const categoriesDict = data.results;
        setCategoriesDict(categoriesDict);
      })
      .catch(error => console.error("Error al obtener los datos de las categorias:", error));
  }, []);

  useEffect(() => {
    fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id}/bid/`)
      .then(response => response.json())
      .then(data => {
        const bids = data.results;
        setBids(bids);
      })
      .catch(error => console.error("Error al obtener los datos de las categorias:", error));
  }, []);

  const handleBid = () => {
    const token = localStorage.getItem("accessToken");
    if (bidAmount && !isNaN(bidAmount)) {
      fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id}/bid/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: bidAmount, auction: id, bidder: userData.username , bidder_id: userData.id}), // Enviar la cantidad de la puja
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.id) {
            window.location.reload();
          } else {
            setErrorMessage(Object.values(data).flat().join(" "));
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
    const token = localStorage.getItem("accessToken");
    if (editBid && bidAmount && !isNaN(bidAmount)) {
      console.log("Updating bid:", editBid.id, bidAmount); // Verificación en consola
      fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id}/bid/${editBid.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: bidAmount, auction: id, bidder: userData.username , bidder_id: userData.id}),
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.id) {
            console.log("Updated bid:", data); // Verificación en consola
            window.location.reload();
          } else {
            setErrorMessage(Object.values(data).flat().join(" "));
          }
        })
        .catch(error => console.error("Error al actualizar la puja:", error));
    }
  };

  // Función para eliminar una puja
  const handleDeleteBid = (bidId) => {
    const token = localStorage.getItem("accessToken");
    fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id}/bid/${bidId}/`, {
      method: 'DELETE',
      Authorization: `Bearer ${token}`,
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
            <p><strong>Auctioneer: </strong>{userData.username}</p>
          </div>

          <div className={styles.rightSection}>
          <div className={styles.bidsSection}>
            <h3>Bids</h3>
            {bids.length > 0 ? (
              <ul className={styles.bidsList}>
                {bids.map((bid, index) => (
                  <li key={index} className={styles.bidItem}>
                    <strong>User:</strong> {bid.bidder} | <strong>Amount:</strong> ${bid.price} | <strong>Date:</strong> {new Date(bid.creation_date).toLocaleString()}
                    {bid.bidder_id === userData.id && (
                      <>
                        <button onClick={() => handleEditBid(bid)}>Edit</button>
                        <button onClick={() => handleDeleteBid(bid.id)}>Delete</button>
                      </>
                    )}
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
            
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          </div>

          <Link href={`/newProduct?id=${id}`}>
                  <input className={styles.bidButton} type="button" value="Edit Product" />
          </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
