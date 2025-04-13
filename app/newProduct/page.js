"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NewProduct.module.css";
import { useSearchParams } from "next/navigation";


export default function NewProduct() {
  const [userData, setUserData] = useState(null);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [rating, setRating] = useState("")
  const [stock, setStock] = useState("")
  const [brand, setBrand] = useState("")
  const [categoriesDict, setCategoriesDict] = useState([]);
  const [strCategories, setStrCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState(""); 
  const [thumbnail, setThumbnail] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [errorMessage, setErrorMessage] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();


  const handleCategoryCreation = async (event) => {
    // Prevenir que el formulario se envíe de forma predeterminada
    event.preventDefault();
    
    // Obtener el nombre de la categoría desde el estado o del input correspondiente
    const newCategoryName = newCategory; // Asumiendo que categoryName es el estado de la categoría a crear
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const response = await fetch("https://htmleaders-backend.onrender.com/api/auctions/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }), // solo enviamos el string con el nombre
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage("Error al crear la categoría: " + errorData.detail);
        return;
      }
  
      const data = await response.json();
      // Actualizar las categorías en el estado después de crear una nueva categoría
      setCategoriesDict((prevCategories) => [...prevCategories, data]);
      setStrCategories((prevCategories) => [
        ...prevCategories,
        data.name,
      ]);
      // Seleccionar la nueva categoría automáticamente después de crearla
      setSelectedCategory(data.name);
  
    } catch (error) {
      setErrorMessage("Error al crear la categoría: " + error.message);
    }
  };
  
  
  const handleProduct = async (event) => {
    event.preventDefault();
  
    if (!title || !description || !price || !rating || !stock || !brand || !selectedCategory || !thumbnail || !closingDate) {
      setErrorMessage("All fields are required");
      return;
    }
  
    // Asegurarse de que la categoría seleccionada tenga un valor válido
    let categoryId = null;
    if (selectedCategory !== "all") {
      const categoryObj = categoriesDict.find((cat) => cat.name === selectedCategory);
      categoryId = categoryObj ? categoryObj.id : null;
    } else {
      categoryId = 1;  // O cualquier valor predeterminado de categoría
    }
  
    const productData = {
      title,
      description,
      price: parseFloat(price),
      rating: parseFloat(rating),
      stock: parseInt(stock, 10),
      brand,
      category: categoryId,  // El ID de la categoría seleccionada
      thumbnail,
      closing_date: new Date(`${closingDate}T23:59:59`).toISOString(),
      auctioneer: userData.id, // ID del usuario
    };
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const response = await fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id ? `${id}/` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === "string"
          ? errorData
          : Object.entries(errorData)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
        setErrorMessage(errorMessage);
        return;
      }
  
      const data = await response.json();
      alert(id ? "Producto editado con éxito" : "Producto creado con éxito");
      router.push("/allProducts");
    } catch (error) {
      setErrorMessage(error.message || "Error desconocido.");
    }
  };
    
  
  useEffect(() => {
    if (!id) return; // Si no hay id, es creación, no hacemos fetch
  
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("accessToken");
    
        const response = await fetch(`https://htmleaders-backend.onrender.com/api/auctions/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) throw new Error("No se pudo cargar el producto");
        const product = await response.json();
    
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price);
        setRating(product.rating);
        setStock(product.stock);
        setBrand(product.brand);
        setSelectedCategory(product.category);
        setThumbnail(product.thumbnail);
        setClosingDate(product.closing_date.split("T")[0]); // Para input date
      } catch (error) {
        console.error(error);
      }
    };    
  
    fetchProduct();
  }, [id]);
  

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
        setStrCategories([...new Set(data.results.map(c => c.name))]);
      } catch (error) {
        console.error("Error al obtener los datos de las categorías:", error);
      }
    };
  
    fetchCategories();
  }, []);
  

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

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <main>
        <form className={styles.form}>
        <h1 className={styles.title}>{id ? "Edit Product" : "Create Product"}</h1>
            
            <label htmlFor="title">Title: </label>
            <input type="text" id="title" name="title" onChange={(e) => setTitle(e.target.value)} required />
            
            <label htmlFor="description">Description: </label>
            <textarea id="description" name="description" onChange={(e) => setDescription(e.target.value)} required></textarea>
            
            <label htmlFor="closingDate">Closing Date: </label>
            <input type="date" id="closingDate" name="closingDate" onChange={(e) => setClosingDate(e.target.value)} required />
            
            <label htmlFor="image">Image: </label>
            <input type="url" id="image" name="image" onChange={(e) => setThumbnail(e.target.value)} required />
            
            <label htmlFor="startingPrice">Starting Price: </label>
            <input type="number" id="startingPrice" name="startingPrice" min="0" step="1" onChange={(e) => setPrice(e.target.value)} required />
            
            <label htmlFor="stock">Stock: </label>
            <input type="number" id="stock" name="stock" min="0" onChange={(e) => setStock(e.target.value)} required />
            
            <label htmlFor="rating">Rating: </label>
            <input type="number" id="rating" name="rating" min="0" max="5" step="0.1" onChange={(e) => setRating(e.target.value)} required />
            
            <label htmlFor="category">Category</label>
            <select
            onChange={(e) => {
              const value = e.target.value;
              console.log('Selected value:', value); // Para verificar el valor seleccionado
              if (value === "new") {
                setCreatingCategory(true);
                setSelectedCategory(""); // Limpiamos cualquier categoría seleccionada
              } else {
                setCreatingCategory(false);
                setSelectedCategory(value); // Establecemos la categoría seleccionada
              }
            }}
            value={creatingCategory ? "new" : selectedCategory} // Asegúrate de que este valor se actualice correctamente
          >
            {strCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
            <option value="new">+ Create new category</option>
          </select>

          {creatingCategory && (
            <div>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => {
                  console.log('New category:', e.target.value); // Verifica el valor del input
                  setNewCategory(e.target.value);
                }}
                placeholder="New category"
              />
              <button type="button" onClick={handleCategoryCreation}>Create category</button>
            </div>
          )}


            
            <label htmlFor="brand">Brand: </label>
            <input type="text" id="brand" name="brand" onChange={(e) => setBrand(e.target.value)} required />
            
            <button type="submit" className={styles.button} onClick={handleProduct}>
              {id ? "Save Changes" : "Create Product"}
            </button>

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </form>
    </main>
  );}