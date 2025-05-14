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
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const [title, setTitle] = useState("");  // Para el título del comentario
  const [text, setText] = useState(""); 
  const [errorMessageRating, setErrorMessageRating] = useState(null);
  const [editComment, setEditComment] = useState(null); // Estado para manejar el comentario que estamos editando
  const [editedTitle, setEditedTitle] = useState("");    // Título editado
  const [editedText, setEditedText] = useState(""); 


  const [isEditingRating, setIsEditingRating] = useState(false);
  const [editRating, setEditRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingAmount, setRatingAmount] = useState("");
  const [userRating, setUserRating] = useState(null);
  

 
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://htmleaders-backend-16ex.onrender.com/api/users/profile/",
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
  fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/comments/`)
    .then(response => response.json())
    .then(data => {
      console.log("Datos recibidos:", data); // Verificar lo que recibes
      const results = data.results;
      setComments(results);
    })
    .catch(error => console.error("Error al obtener los comentarios:", error));
}, [id]);


  
  useEffect(() => {
    console.log('Product ID:', id); // Verifica si el id llega correctamente
    if (id) {
      fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/`)
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
    fetch("https://htmleaders-backend-16ex.onrender.com/api/auctions/categories/")
      .then(response => response.json())
      .then(data => {
        const categoriesDict = data.results;
        setCategoriesDict(categoriesDict);
      })
      .catch(error => console.error("Error al obtener los datos de las categorias:", error));
  }, []);

  useEffect(() => {
    fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/bid/`)
      .then(response => response.json())
      .then(data => {
        const bids = data.results;
        setBids(bids);
      })
      .catch(error => console.error("Error al obtener los datos de las categorias:", error));
  }, []);

  useEffect(() => {
    fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/rating/`)
      .then(response => response.json())
      .then(data => {
        const ratings = data.results;
        setRatings(ratings);
        // Verificar si el usuario ya tiene un rating
        const userRating = ratings.find(rating => rating.rater_id === userData?.id);
        setUserRating(userRating);
      })
      .catch(error => console.error("Error obtaining ratings:", error));
    }, [id, userData]);

  const handleBid = () => {
    const token = localStorage.getItem("accessToken");
    if (bidAmount && !isNaN(bidAmount)) {
      fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/bid/`, {
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
      fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/bid/${editBid.id}/`, {
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
    fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/bid/${bidId}/`, {
      method: 'DELETE',
      Authorization: `Bearer ${token}`,
    })
      .then(() => {
        setBids(prevBids => prevBids.filter(bid => bid.id !== bidId)); // Elimina la puja de la lista
      })
      .catch(error => console.error("Error al eliminar la puja:", error));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, text, auction: id })
  });

  if (response.ok) {
    const newComment = await response.json();
    setComments([...comments, newComment]);
    setTitle("");
    setText("");
  } else {
    console.error("Error al enviar comentario");
  }
};

const handleEditComment = (comment) => {
  setEditComment(comment); // Inicializa el estado editComment con el comentario seleccionado
  setEditedTitle(comment.title); // Inicializa el estado editedTitle con el título del comentario
  setEditedText(comment.text);   // Inicializa el estado editedText con el texto del comentario
};

const handleUpdateComment = (e) => {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");

  if (editComment && editedTitle && editedText) {
    console.log("Updating comment:", editComment.id, editedTitle, editedText); // Verificación en consola

    // Realiza la solicitud para actualizar el comentario
    fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/comments/${editComment.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editedTitle, // Título actualizado del comentario
        text: editedText,   // Texto actualizado del comentario
        auction: id,        // Id de la subasta
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.id) {
          console.log("Updated comment:", data); // Verificación en consola
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === data.id ? data : comment
            )
          ); // Actualiza el comentario en el estado
          setEditComment(null); // Cierra el formulario de edición
        } else {
          setErrorMessage(Object.values(data).flat().join(" ")); // Muestra el error si no se pudo actualizar
        }
      })
      .catch(error => console.error("Error al actualizar el comentario:", error));
  }
};
const handleDeleteComment = (commentId) => {
  const token = localStorage.getItem("accessToken");
  
  fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/comments/${commentId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (response.ok) {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } else {
        console.error('Error al eliminar el comentario');
      }
    })
    .catch(error => console.error("Error al eliminar el comentario:", error));
};

  const handleRating = () => {
    const token = localStorage.getItem("accessToken");
    if (ratingAmount && !isNaN(ratingAmount)) {
      fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/rating/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: ratingAmount, auction: id, rater: userData.username , rater_id: userData.id}), // Enviar la cantidad de la puja
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.id) {
            window.location.reload();
          } else {
            setErrorMessageRating(Object.values(data).flat().join(" "));
          }
        })
        .catch(error => console.error("Error making the rate:", error));
    } else {
      alert("Please enter a valid rate amount.");
    }
  };

  // Función para iniciar edición
  const handleEditRating = (rating) => {
    setEditRating(rating);
    setRatingAmount(rating.rating);
    setIsEditingRating(true);
  };

  // Función para guardar cambios en la valoración
  const handleUpdateRating = () => {
      const token = localStorage.getItem("accessToken");
      if (editRating && ratingAmount && !isNaN(ratingAmount)) {
        console.log("Updating rating:", editRating.id, ratingAmount); // Verificación en consola
        fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/rating/${editRating.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({rating: ratingAmount, auction: id, rater: userData.username , rater_id: userData.id}),
        })
          .then(response => response.json())
          .then(data => {
            if (data && data.id) {
              console.log("Updated rating:", data); // Verificación en consola
              setIsEditingRating(false);
              window.location.reload();
            } else {
              setErrorMessageRating(Object.values(data).flat().join(" "));
            }
          })
          .catch(error => console.error("Error actualizing rating:", error));
        }
      };

  // Función para eliminar una calificación
  const handleDeleteRating = (ratingId) => {
    const token = localStorage.getItem("accessToken");
    fetch(`https://htmleaders-backend-16ex.onrender.com/api/auctions/${id}/rating/${ratingId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setRatings(prevRatings => prevRatings.filter(rating => rating.id !== ratingId)); // Elimina la calificación de la lista
        setUserRating(null); // Elimina el rating del usuario
        window.location.reload();
      })
      .catch(error => console.error("Error elimitating rating:", error));
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
            <p><strong>Auctioneer: </strong>{product.auctioneer}</p>
            <p><strong>Average Rating: </strong>{product.rating || 'Not rated yet'}</p>
            <p><strong>My rating:</strong></p>
            {userRating ? (
              <>
                {isEditingRating ? (
                  <>
                    <input
                      type="number"
                      value={ratingAmount}
                      min="1"
                      max="5"
                      onChange={(e) => setRatingAmount(e.target.value)}
                      className={styles.ratingInput}
                    />
                    <button onClick={handleUpdateRating}>Save Rating</button>
                    <button onClick={() => setIsEditingRating(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p>{'★'.repeat(userRating.rating)}</p>
                    <button onClick={() => handleEditRating(userRating)}>Edit Rating</button>
                    <button onClick={() => handleDeleteRating(userRating.id)}>Delete Rating</button>
                  </>
                )}
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={ratingAmount}
                  min="1"
                  max="5"
                  onChange={(e) => setRatingAmount(e.target.value)}
                  placeholder="Enter rating amount"
                  className={styles.ratingInput}
                />
                <button className={styles.bidButton} onClick={handleRating}>
                  Place Rating
                </button>
              </>
            )}
            {errorMessageRating && <p className={styles.errorMessage}>{errorMessageRating}</p>}
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

            <h3>Comments</h3>
            {editComment && (
            <form onSubmit={handleUpdateComment} className={styles.commentForm}>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Nuevo título"
                required
              />
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Nuevo comentario"
                required
              />
              <button type="submit">Actualizar comentario</button>
            </form>
          )}

            {Array.isArray(comments) && comments.map(comment => (
            <div key={comment.id} className={styles.commentItem}>
              <h4>{comment.title}</h4>
              <p>{comment.text} </p>

              <small>{comment.user} - {new Date(comment.created_at).toLocaleString()}</small>
                {comment.created_at !== comment.updated_at && (
              <small>
                Última modificación: {new Date(comment.updated_at).toLocaleString()}
              </small>
                )}

              <div className={styles.commentActions}>

              {userData.username===comment.user && (
                  <>
                    <button onClick={() => handleEditComment(comment)}>Editar</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>Eliminar</button>
                  </>
                )}

              </div>
            </div>
          ))}

          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" required /><br/>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Comentario" required />
          <button type="submit">Enviar comentario </button>
          </form>
            
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          </div>

          {userData?.id === product?.auctioneer && (
            <Link href={`/newProduct?id=${id}`}>
              <button className={styles.bidButton} >Edit Product</button>
            </Link>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
