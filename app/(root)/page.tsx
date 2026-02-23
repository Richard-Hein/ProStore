import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import {getLatestProducts} from "@/lib/actions/product.action"
export const metadata = {
  title: 'Home'
};
const Home = async () => {
  const latestProductsRaw = await getLatestProducts();
  const latestProducts = latestProductsRaw.map((product) => ({
    ...product,
    price: product.price.toString(),
    // If rating is also a Decimal and Product expects string, convert it as well:
    rating: product.rating?.toString?.() ?? product.rating,
  }));
  return (
    <ProductList data={latestProducts} title="Newest Arrivals" />
  );
}

export default Home
