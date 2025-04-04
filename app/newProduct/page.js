"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NewProduct.module.css";

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
  const router = useRouter();

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      alert("Category name cannot be null");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auctions/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });
  
      if (!response.ok) {
        throw new Error("Error creating category");
      }
  
      const createdCategory = await response.json();
  
      // Agregar nueva categoría a la lista y seleccionarla automáticamente
      setStrCategories([...strCategories, createdCategory.name]);
      setSelectedCategory(createdCategory.name);
      setCreatingCategory(false);
      setNewCategory(""); // Limpiar input
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleProduct = async (event) => {
    event.preventDefault(); // Evita la recarga del formulario
  
    if (!title || !description || !price || !rating || !stock || !brand || !selectedCategory || !thumbnail || !closingDate) {
      alert("All fields are required");
      return;
    }
  
    // Convertir category de nombre a ID
    const categoryObj = categoriesDict.find((cat) => cat.name === selectedCategory);
    if (!categoryObj) {
      alert("Not valid category");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          rating: parseFloat(rating),
          stock: parseInt(stock, 10),
          brand,
          category: categoryObj.id, // Enviar el ID en lugar del nombre
          thumbnail,
          closing_date: new Date(`${closingDate}T23:59:59`).toISOString(), // Asignar hora a closingDate porque solo con el día no cale
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al subir el producto.");
      }
  
      console.log("Producto creado:", data);
      alert("Producto creado con éxito.");
      router.push("/allProducts"); 
    } catch (error) {
      console.error("Error al subir el producto:", error);
      alert("Error al crear el producto.");
    }
  };
  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/categories/")
      .then(response => response.json())
      .then(data => {
        const categoriesDict = data.results;
        setCategoriesDict(categoriesDict);
        setStrCategories([...new Set(data.results.map(c => c.name))]);
      })
      .catch(error => console.error("Error al obtener los datos de las categorías:", error));
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

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <main>
        <form className={styles.form}>
            <h1 className={styles.title}>Create Product</h1>
            
            <label htmlFor="title">Title: </label>
            <input type="text" id="title" name="title" onChange={(e) => setTitle(e.target.value)} required />
            
            <label htmlFor="description">Description: </label>
            <textarea id="description" name="description" onChange={(e) => setDescription(e.target.value)} required></textarea>
            
            <label htmlFor="closingDate">Closing Date: </label>
            <input type="date" id="closingDate" name="closingDate" onChange={(e) => setClosingDate(e.target.value)} required />
            
            <label htmlFor="image">Image: </label>
            <input type="url" id="image" name="image" onChange={(e) => setThumbnail(e.target.value)} required />
            
            <label htmlFor="startingPrice">Starting Price: </label>
            <input type="number" id="startingPrice" name="startingPrice" min="0" step="0.01" onChange={(e) => setPrice(e.target.value)} required />
            
            <label htmlFor="stock">Stock: </label>
            <input type="number" id="stock" name="stock" min="0" onChange={(e) => setStock(e.target.value)} required />
            
            <label htmlFor="rating">Rating: </label>
            <input type="number" id="rating" name="rating" min="0" max="5" step="0.1" onChange={(e) => setRating(e.target.value)} required />
            
            <label htmlFor="category">Category</label>
            <select
            onChange={(e) => {
              if (e.target.value === "new") {
                setCreatingCategory(true);
              } else {
                setCreatingCategory(false);
                setSelectedCategory(e.target.value);
              }
            }}
            value={creatingCategory ? "new" : selectedCategory}
            >
              {strCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
              <option value="new">+ Create new category</option>
            </select>

            {creatingCategory && (
              <div>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                />
                <button onClick={handleCreateCategory}>Crear</button>
              </div>
            )}
            
            <label htmlFor="brand">Brand: </label>
            <input type="text" id="brand" name="brand" onChange={(e) => setBrand(e.target.value)} required />
            
            <button type="submit" className={styles.button} onClick={handleProduct}>Create Product</button>
        </form>
    </main>
  );}