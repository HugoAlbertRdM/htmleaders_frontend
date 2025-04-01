"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserData.module.css";

export default function UserData() {
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
    <main className={styles.main}>
      <h1 className={styles.h1}>Datos del Usuario</h1>
      <div className={styles.userData}>
        <p><strong>Nombre:</strong> {userData.first_name} {userData.last_name}</p>
        <p><strong>Usuario:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Birthday:</strong> {userData.birth_date}</p>
        <p><strong>Locality:</strong> {userData.locality}</p>
        <p><strong>Municipality:</strong> {userData.municipality}</p><br></br>

        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
      </div>
      
    </main>
  );}