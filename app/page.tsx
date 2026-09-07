export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QualityGallery from "@/components/QualityGallery";
import Featured from "@/components/Featured";
import Inventory from "@/components/Inventory";
import Warranty from "@/components/Warranty";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
// Cotizador / plan canje: lógica aparte, deshabilitada por ahora
// import TradeInBanner from "@/components/TradeInBanner";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HomeClient from "@/components/HomeClient";
import { getProducts } from "@/lib/airtable";

export default async function Home() {
  const products = await getProducts();

  return (
    <HomeClient>
      <Navbar />
      <Hero products={products} />
      <QualityGallery products={products} />
      <Featured products={products} />
      <Inventory products={products} />
      <Warranty />
      <Reviews />
      <Location />
      {/* <TradeInBanner /> */}
      <Footer />
      <WhatsAppFloat />
    </HomeClient>
  );
}
