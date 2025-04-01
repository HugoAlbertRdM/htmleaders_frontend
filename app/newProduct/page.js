"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NewProduct.module.css";

export default function NewProduct() {
  const [userData, setUserData] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  if (!userData) {
    return <p>Cargando...</p>;
  }

  return (
    <main>
        <form className={styles.form}>
            <h1 className={styles.title}>Create Product</h1>
            
            <label htmlFor="title">Title: </label>
            <input type="text" id="title" name="title" required />
            
            <label htmlFor="description">Description: </label>
            <textarea id="description" name="description" required></textarea>
            
            <label htmlFor="closingDate">Closing Date: </label>
            <input type="date" id="closingDate" name="closingDate" required />
            
            <label htmlFor="creationDate">Auction Creation Date: </label>
            <input type="date" id="creationDate" name="creationDate" required />
            
            <label htmlFor="image">Image: </label>
            <input type="file" id="image" name="image" accept="image/*" required />
            
            <label htmlFor="startingPrice">Starting Price: </label>
            <input type="number" id="startingPrice" name="startingPrice" min="0" step="0.01" required />
            
            <label htmlFor="stock">Stock: </label>
            <input type="number" id="stock" name="stock" min="0" required />
            
            <label htmlFor="rating">Rating: </label>
            <input type="number" id="rating" name="rating" min="0" max="5" step="0.1" required />
            
            <label htmlFor="category">Category: </label>
            <input type="text" id="category" name="category" required />
            
            <label htmlFor="brand">Brand: </label>
            <input type="text" id="brand" name="brand" required />
            
            <button type="submit" className={styles.button}>Create Product</button>
        </form>
    </main>
  );}