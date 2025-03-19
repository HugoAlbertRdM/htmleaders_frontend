import styles from "./Faq.module.css"

export default function Faq() {
    return (
      <section className={styles.faqContainer}>
        <h1>Frequently Asked Questions</h1>

        <div className={styles.faqItem}>
          <h2>What is htmLeaders?</h2>
          <p>htmLeaders is an innovative auction platform created by young entrepreneurs with the aim of making auctions accessible, secure, and efficient for everyone.</p>
        </div>

        <div className={styles.faqItem}>
          <h2>How do I participate in an auction?</h2>
          <p>To participate, simply create an account on htmLeaders, browse through the available auctions, and place your bid on the items you like.</p>
        </div>

        <div className={styles.faqItem}>
          <h2>Are my transactions secure?</h2>
          <p>Yes, we use advanced encryption and security measures to ensure all transactions are safe and reliable.</p>
        </div>

        <div className={styles.faqItem}>
          <h2>How do I know if I won an auction?</h2>
          <p>You will receive a notification via email and within the platform if you are the winning bidder of any auction.</p>
        </div>

        <div className={styles.faqItem}>
          <h2>Can I sell items on htmLeaders?</h2>
          <p>Absolutely! You can list your items for auction by creating a seller account. Once your listing is approved, your items will be available for bidding.</p>
        </div>
      </section>
    );
  }