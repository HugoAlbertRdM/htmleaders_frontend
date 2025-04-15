// app/newProduct/page.js
import NewProductForm from "./newProduct";
import { Suspense } from 'react';

export default function NewProductPage() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
      <NewProductForm />
  </Suspense>);
}
