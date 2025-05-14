"use client"; 

import styles from "./Home.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const token = localStorage.getItem("accessToken");

        const respuesta = await fetch("https://htmleaders-backend-16ex.onrender.com/api/auctions/", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) throw new Error("Error al obtener los productos");

        const datos = await respuesta.json();
        setProductos(datos.results);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    }
    obtenerProductos();
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    if (productos.length === 0) return;

    const interval = setInterval(() => {
      setIndice((prevIndice) => (prevIndice + 1) % productos.length);
    }, 3000); // Cambia de producto cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [productos]); // Se ejecuta cuando `productos` cambia

  // Si no hay productos, mostrar mensaje de carga
  if (productos.length === 0) {
    return <p>Cargando productos...</p>;
  }

  const producto = productos[indice];

  return (
    <main>
      <h1 className={styles.title}>Nuestros mejores productos</h1>
      <div id={styles.home}>
        <img className={styles.img} src={producto.thumbnail} alt={producto.title} />
        <h2 className={styles.h2}>{producto.title}</h2>
        <p className={styles.p}>Precio: ${producto.price}</p>
      </div>
    </main>
  );
}
