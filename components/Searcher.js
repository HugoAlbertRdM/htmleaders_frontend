// src/components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";

import styles from "./styles/Searcher.module.css";

export default function Header() {
  return (
    <input className={styles.searcher} type="text" placeholder="Search.."></input>
  );
}