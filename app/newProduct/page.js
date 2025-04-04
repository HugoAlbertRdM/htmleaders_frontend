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
    event.preventDefault(); 
  
    if (!title || !description || !price || !rating || !stock || !brand || !selectedCategory || !thumbnail || !closingDate) {
      setErrorMessage("All fields are required");
      return;
    }
  
    const categoryObj = categoriesDict.find((cat) => cat.name === selectedCategory);
    const categoryId = categoryObj ? categoryObj.id : selectedCategory; // Si ya es ID, úsalo directamente
  
    const productData = {
      title,
      description,
      price: parseFloat(price),
      rating: parseFloat(rating),
      stock: parseInt(stock, 10),
      brand,
      category: categoryId, // Usamos el ID correcto
      thumbnail,
      closing_date: new Date(`${closingDate}T23:59:59`).toISOString(),
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id ? `${id}/` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
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
        const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`);
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
            
            <button type="submit" className={styles.button} onClick={handleProduct}>
              {id ? "Save Changes" : "Create Product"}
            </button>

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </form>
    </main>
  );}