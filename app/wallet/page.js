"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./wallet.module.css";

export default function WalletPage() {
  const [balance, setBalance] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("topup"); // "topup" o "withdraw"
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [walletExists, setWalletExists] = useState(false); // Nueva variable para verificar si la cartera existe
  const router = useRouter();

  const token =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    // Intentar obtener el saldo
    fetch("http://127.0.0.1:8000/api/auctions/wallet/balance/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 400) {
          // Si el código de estado es 400, la cartera no existe, entonces mostramos el formulario
          setError("No tienes una cartera. Por favor, crea una.");
          setWalletExists(false);
          return;
        }
        if (!res.ok) throw new Error("No se pudo obtener el saldo");
        return res.json();
      })
      .then((data) => {
        setBalance(data.balance); // Establece el saldo
        setWalletExists(true); // Si obtenemos el saldo, significa que existe una cartera
      })
      .catch((err) => {
        setError("No se pudo obtener el saldo. " + err.message);
        setWalletExists(false); // Si no existe la cartera, mostramos el formulario para crearla
      });
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validaciones cliente
    const cardRegex = /^\d{13,19}$/;
    if (!cardRegex.test(cardNumber)) {
      setError("El número de tarjeta debe tener solo dígitos (13–19 caracteres).");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 10) {
      setError("La cantidad debe ser un número válido y al menos 10€.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/auctions/wallet/${action}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            card_number: cardNumber,
            amount: amt,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || JSON.stringify(data));
      } else {
        setBalance(data.balance);
        setMessage(
          action === "topup"
            ? `Ingreso exitoso. Tu nuevo saldo es ${data.balance}€`
            : `Retirada exitosa. Tu nuevo saldo es ${data.balance}€`
        );
        setAmount("");
      }
    } catch (err) {
      setError("Error de red: " + err.message);
    }
  };

  const handleCreateWallet = async (e) => {
    e.preventDefault();

    setError(null);

    if (!cardNumber) {
      setError("El número de tarjeta es obligatorio.");
      return;
    }

    // Crear la cartera para el usuario
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auctions/wallet/balance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ card_number: cardNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setMessage(`Cartera creada exitosamente. Tu saldo es ${data.balance}€`);
        setWalletExists(true); // Ahora existe la cartera
      } else {
        setError(data.detail || "Error al crear la cartera.");
      }
    } catch (err) {
      setError("Error al crear la cartera: " + err.message);
    }
  };

  if (balance === null && !walletExists) {
    return (
      <main className={styles.walletContainer}>
        <div className={styles.walletContent}>
          <h1>Monedero Virtual</h1>
          <p>{error}</p>

          <form onSubmit={handleCreateWallet} className={styles.form}>
            <label>Número de tarjeta:</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="13–19 dígitos"
              required
            />
            <button type="submit" className={styles.submitButton}>
              Crear cartera
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (balance === null) {
    return <p className={styles.walletContainer}>Cargando saldo...</p>;
  }

  return (
    <main className={styles.walletContainer}>
      <div className={styles.walletContent}>
        <h1>Monedero Virtual</h1>
        <p className={styles.balance}>
          <strong>Saldo actual:</strong> {balance}€
        </p>

        <div className={styles.actionToggle}>
          <button
            className={`${styles.toggleButton} ${
              action === "topup" ? styles.active : ""
            }`}
            onClick={() => setAction("topup")}
          >
            Ingresar
          </button>
          <button
            className={`${styles.toggleButton} ${
              action === "withdraw" ? styles.active : ""
            }`}
            onClick={() => setAction("withdraw")}
          >
            Retirar
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Número de tarjeta:</label>
          <input
            type="text"
            value={cardNumber}
              onChange={(e) => {
                const value = e.target.value;
                // Validar que el valor tenga entre 13 y 19 dígitos
                if (value.length >= 13 && value.length <= 19) {
                setCardNumber(value);
                                   }
                                        }}
            placeholder="13–19 dígitos"
            
            required
          />

          <label>Cantidad (€):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            step="0.01"
            required
          />

          <button type="submit" className={styles.submitButton}>
            {action === "topup" ? "Ingresar dinero" : "Retirar dinero"}
          </button>
        </form>

        {message && (
          <p className={`${styles.message} ${styles.success}`}>{message}</p>
        )}
        {error && (
          <p className={`${styles.message} ${styles.error}`}>{error}</p>
        )}
      </div>
    </main>
  );
}