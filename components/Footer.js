import styles from "./styles/Footer.module.css";

export default function Footer() {
    return (
    <footer className= {styles.footer}>
        <p className={styles.p}>
          {" "}
          Creado por <b>Hugo Albert y Santiago Moreno </b>{" "}
        </p>
    </footer>
    );
  }
  