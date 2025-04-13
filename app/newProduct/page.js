// app/newProduct/page.js
import NewProductForm from "./newProduct";

export default function NewProductPage() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
      <NewProductForm />
  </Suspense>);
}
