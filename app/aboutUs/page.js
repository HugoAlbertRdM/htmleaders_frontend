import styles from "./AboutUs.module.css"; // Import the CSS module

export default function AboutUs() {
  return (
    <main className={styles.aboutContainer}>
      <section className={styles.aboutContent}>
        <h1>About Us</h1>
        <p>
          Welcome to <strong>htmLeaders</strong>, the auction platform created by two young
          entrepreneurs passionate about technology and innovation.
        </p>
        <p>
          As part of Generation Z, we understand the importance of speed, transparency, and
          accessibility in the digital world. Our mission is to offer a secure and efficient platform
          where buyers and sellers can easily connect.
        </p>
        <h2>Why htmLeaders?</h2>
        <ul>
          <li>✅ Real-time auctions with a smooth experience.</li>
          <li>✅ Security and trust in every transaction.</li>
          <li>✅ Modern and user-friendly interface.</li>
          <li>✅ Exclusive opportunities for buyers and sellers.</li>
        </ul>
        <p>
          Join us and be part of the evolution of online auctions.
          See you at <strong>htmLeaders</strong>! 🚀
        </p>
      </section>
    </main>
  );
}
