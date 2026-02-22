import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import {getLatestProducts} from "@/lib/actions/product.action"
export const metadata = {
  title: 'Home'
};
const Home= async() => {
  const latestProducts = await getLatestProducts();
  return (
   <ProductList data={latestProducts} title="Newest Arrivals" />
  );
}

export default Home
