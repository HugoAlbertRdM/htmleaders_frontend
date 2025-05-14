"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserData.module.css";

export default function UserData() {
  const [userData, setUserData] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
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
          "https://htmleaders-backend-16ex.onrender.com/api/users/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch user data");
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    };

    const fetchUserAuctions = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://htmleaders-backend-16ex.onrender.com/api/users/my-auctions/", // Endpoint para subastas
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch auctions");
        }

        const auctions = await response.json();
        setAuctions(auctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    const fetchUserBids = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://htmleaders-backend-16ex.onrender.com/api/users/my-bids/", // Endpoint para pujas
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch bids");
        }

        const bids = await response.json();
        setBids(bids);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    const fetchUserComments = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://htmleaders-backend-16ex.onrender.com/api/users/my-comments/", // Endpoint para comments
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch comments");
        }

        const comments = await response.json();
        setComments(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchUserRatings = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://htmleaders-backend-16ex.onrender.com/api/users/my-ratings/", // Endpoint para ratings
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch ratings");
        }

        const ratings = await response.json();
        setRatings(ratings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchUserData();
    fetchUserAuctions();
    fetchUserBids();
    fetchUserComments();
    fetchUserRatings();
  }, [router]);

  const logoutUser = async () => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    const response = await fetch("https://htmleaders-backend-16ex.onrender.com/api/users/log-out/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      router.push("/login");
    } else {
      console.error("Error while logging out", response);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>User Data</h1>
      <div className={styles.userData}>
        <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Birthday:</strong> {userData.birth_date}</p>
        <p><strong>Locality:</strong> {userData.locality}</p>
        <p><strong>Municipality:</strong> {userData.municipality}</p>
        <br />
        <div className={styles.section}>
          <h2>My Bids</h2>
          {bids.length > 0 ? (
            <ul>
              {bids.map((bid, index) => (
                <li key={index}>
                  <strong>{bid.auction_title}</strong> | ${bid.price} | {new Date(bid.creation_date).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no bids.</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>My Products</h2>
          {auctions.length > 0 ? (
            <ul>
              {auctions.map((auction, index) => (
                <li key={index}>
                  <strong>{auction.title}</strong> | ${auction.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no products.</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>My Comments</h2>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.auction_title}</strong> | {comment.title} | <i>{comment.text}</i>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no comments.</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>My Ratings</h2>
          {ratings.length > 0 ? (
            <ul>
              {ratings.map((rating, index) => (
                <li key={index}>
                  <strong>{rating.auction_title}</strong> | {rating.rating}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no ratings.</p>
          )}
        </div>

        <button onClick={() => router.push("/changePassword")} className={styles.logoutButton}>Change Password</button>
        <button onClick={logoutUser} className={styles.logoutButton}>Logout</button>
      </div>
    </main>
  );
}
