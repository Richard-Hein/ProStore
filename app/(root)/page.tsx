import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import {getFeaturedProducts, getLatestProducts} from "@/lib/actions/product.action"
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
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
    {featuredProducts.length >0 && <ProductCarousel data={featuredProducts}/>}
    <ProductList data={latestProducts} title="Newest Arrivals" />
    <ViewAllProductsButton/>
    </>
    
  );
}

export default Home
