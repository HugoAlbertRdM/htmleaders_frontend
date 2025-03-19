// src/components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";

import styles from "./styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.leftnav}>
        <Link href="./home">
          <Image src="/images/Logo_NoBack.png" alt="Home" width={100} height={50} className={styles.logo_home} />
        </Link>
        <h1 className={styles.title}>htmLeaders</h1>
      </nav>
      <nav className={styles.centernav}>
        <Link href="./allProducts">All products</Link>
        <Link href="./aboutUs">About us</Link>
        <Link href="./faq">FAQ</Link>
        <Link href="./user">User</Link>
      </nav>
      <nav className={styles.rightnav}>
        <Link className={styles.register} href="./register">Register</Link>
        <Link className={styles.login} href="./login">Login</Link>
      </nav>
    </header>
  );
}