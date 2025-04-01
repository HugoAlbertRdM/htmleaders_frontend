"use client";
 
 import styles from "./Login.module.css";
 import { useRouter } from "next/navigation";


const login = async (username, password) => {
  try {
    const response = await fetch(
      "https://das-p2-backend.onrender.com/api/users/login/",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const tokenData = await response.json();
    

    localStorage.setItem("accessToken", tokenData.access);


    return tokenData;
  } catch (error) {
    console.error(error);
    return null;
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
       router.push("/user");
     } else {
       alert("Incorrect password or username");
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
  