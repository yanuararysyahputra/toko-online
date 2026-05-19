export const dynamic =
  "force-dynamic";
import { prisma } from "@/lib/prisma";
import ProductsPageClient from "./ProductsPageClient";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return (
    <ProductsPageClient products={products} />
  );
}