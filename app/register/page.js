"use client";
 
 import { useState } from 'react';  // Solo importa useState
 
 import { useRouter } from "next/navigation";
 import Link from 'next/link';
 import styles from "./Register.module.css";
 
 
 
 const registerUser = async (formData) => {
   try {
 
     console.log("Datos enviados:", JSON.stringify(formData));
     const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(formData),
     });
 
     
 
     if (!response.ok) {
       const errorData = await response.json();
       console.error("Respuesta del servidor:", errorData);
       throw new Error("Error en el registro: " + (errorData.message || response.statusText));
     
     }
 
     const userData = await response.json();
 
 
     localStorage.setItem("accessToken", userData.access);
     localStorage.setItem("refreshToken", userData.refresh);
     localStorage.setItem("user", JSON.stringify(userData.user));
 
     return userData;
   } catch (error) {
     console.error(error);
     return null;
   }
 
 };

const communities = {
  "Andalucía": ["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
  "Aragón": ["Huesca", "Teruel", "Zaragoza"],
  "Asturias": ["Oviedo", "Gijón", "Avilés"],
  "Cantabria": ["Santander", "Torrelavega"],
  "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
  "Castilla y León": ["Ávila", "Burgos", "León", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
  "Cataluña": ["Barcelona", "Girona", "Lleida", "Tarragona"],
  "Ceuta": ["Ceuta"],
  "Extremadura": ["Badajoz", "Cáceres"],
  "Galicia": ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
  "Islas Baleares": ["Palma de Mallorca", "Ibiza", "Mahón"],
  "Islas Canarias": ["Las Palmas", "Santa Cruz de Tenerife"],
  "La Rioja": ["Logroño"],
  "Madrid": ["Madrid"],
  "Melilla": ["Melilla"],
  "Murcia": ["Murcia"],
  "Navarra": ["Pamplona"],
  "País Vasco": ["Bilbao", "San Sebastián", "Vitoria-Gasteiz"],
  "Valencia": ["Alicante", "Castellón", "Valencia"]
};

export default function Register() {
  const [ageMessage, setAgeMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const data = new FormData(event.currentTarget);
    const formData = {
      username: data.get("user"),
      email: data.get("mail"),
      password: data.get("psw1"),
      first_name: data.get("name"),
      last_name: data.get("last_name"),
      birth_date: data.get("age"),
      locality: data.get("community"),
      municipality: data.get("city"),

    };

    const user = await registerUser(formData);
    if (user) {
      alert("Registro exitoso. Ahora inicia sesión.");
      router.push("/login"); 
    } else {
      setError("Registro fallido. Intenta con otro usuario o email.");
    }
  };


  // Función para validar la edad
  const validAge = (e) => {
    const age = e.target.value;
    const currentDate = new Date();
    const birthDate = new Date(age);
    const ageInMilliseconds = currentDate - birthDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);

    
    if (ageInYears < 18) {
      setAgeMessage('You must be at least 18 years old.');
    } else {
      setAgeMessage('');
    }
  };

  // Función para validar las contraseñas
  const validPassword = () => {
    const psw1 = document.getElementById("psw1").value;
    const psw2 = document.getElementById("psw2").value;
    if (psw1 !== psw2) {
      setPasswordMessage('Passwords do not match.');
    } else {
      setPasswordMessage('');
    }
  };

  const handleCommunityChange = (e) => {
    const community = e.target.value;
    setSelectedCommunity(community);
    setCities(communities[community] || []);
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <>
        <main>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h1 className={styles.title}>Register</h1>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" placeholder="John" required />

              <label htmlFor="last_name">Last name:</label>
              <input type="text" id="last_name" name="last_name" placeholder="Doe" required />

              <label htmlFor="imagen">Introduce your image:</label>
              <input type="file" id="imagen" name="imagen" />

              <label htmlFor="direction">Direction:</label>
              <input type="text" id="direction" name="direction" placeholder="ABC Street 123th" />

              <label htmlFor="user">Username:</label>
              <input type="text" id="user" name="user" placeholder="JohnDoe" required />

              <label htmlFor="mail">Mail:</label>
              <input type="email" id="mail" name="mail" placeholder="abc@def.com" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" required />

              <label htmlFor="age">Birthday:</label>
              <input type="date" id="age" name="age" onBlur={validAge} required />
              <p id="age_message">{ageMessage}</p>

              <label htmlFor="community">Community:</label>
              <select id="community" name="community" onChange={handleCommunityChange} required>
                <option value="" >Select a community</option>
                {Object.keys(communities).map((community) => (
                  <option key={community} value={community}>{community}</option>
                ))}
              </select>

              <label htmlFor="city">City:</label>
              <select id="city" name="city" onChange={handleCityChange} required disabled={cities.length === 0}>
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <label htmlFor="psw1">Password:</label>
              <input type="password" id="psw1" name="psw1" minLength="8" onBlur={validPassword} required />

              <label htmlFor="psw2">Repeat password:</label>
              <input type="password" id="psw2" name="psw2" minLength="8" onBlur={validPassword} required />

              <p id="mensaje">{passwordMessage}</p>


              <Link href="./login">
                  <input className={styles.button} type="button" value="Return" />
              </Link>

              <input className={styles.button} type="reset" value="Clean" />
              <input className={styles.button} type="submit" value="Submit" />
            </form>
        </main>
    </>
  );
}
