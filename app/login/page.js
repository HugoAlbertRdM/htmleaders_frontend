"use client";
 
 import styles from "./Login.module.css";
 import { useRouter } from "next/navigation";


 const login = async (username, password) => {
  try {
    // 1. Login: obtener tokens
    const tokenRes = await fetch("https://htmleaders-backend-16ex.onrender.com/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json(); // Primer read
      throw new Error(errorData?.detail || "Login failed");
    }

    const { access, refresh } = await tokenRes.json(); // Segundo read, ya no puedes hacer otro .json() aquí
    console.log('Access Token:', access); // Para verificar si el token es correcto

    // 2. Obtener perfil de usuario con el token
    const profileRes = await fetch("https://htmleaders-backend-16ex.onrender.com/api/users/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    });
    console.log('Profile Response:', profileRes); // Verifica el status y headers

    if (!profileRes.ok) {
      const errorData = await profileRes.json(); // Lee la respuesta solo una vez
      throw new Error(errorData?.detail || "Could not fetch user profile");
    }

    const userData = await profileRes.json(); // Ahora puedes usar los datos

    // 3. Guardar en localStorage
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(userData));

    return true;
  } catch (error) {
    console.error("Login error:", error.message);
    return false;
  }
};


export default function Login() {

  const router = useRouter();
   const handleSubmit = async (event) => {
     event.preventDefault();
 
     const data = new FormData(event.currentTarget);
     const name = data.get("user");
     const passwd = data.get("password");
 
     const tokenData = await login(name, passwd);

     if (tokenData) {
      // Confirmamos que el token está bien guardado
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        router.push("/user");
      } else {
        alert("Error: No se pudo guardar el token");
      }
    }
   };

    return (
      <main>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login</h1>
          <label htmlFor="user">Username:</label><br />
          <input type="text" id="user" name="user" /><br />
          
          <label htmlFor="password">Password:</label><br />
          <input type="password" id="password" name="password" minLength="8" /><br /><br />
  
          <input className={styles.button} type="submit" value="Submit" /><br />
        </form>
      </main>
    );
  }
  